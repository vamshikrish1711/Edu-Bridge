# backend/app.py
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

from config import Config
from extensions import cors, db, jwt, migrate


def create_app(config_overrides=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if config_overrides:
        app.config.update(config_overrides)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": [app.config["FRONTEND_ORIGIN"]]}},
    )

    from routes import BLUEPRINTS

    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint, url_prefix="/api")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Not found."}), 404

    @app.errorhandler(405)
    def wrong_method(_error):
        return jsonify({"error": "Method not allowed."}), 405

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify({"error": "File is larger than 20 MB."}), 413

    @app.errorhandler(HTTPException)
    def http_error(error):
        return jsonify({"error": error.description}), error.code

    @app.errorhandler(Exception)
    def server_error(error):
        app.logger.exception(error)
        return jsonify({"error": "Server error."}), 500

    @jwt.unauthorized_loader
    def missing_token(_reason):
        return jsonify({"error": "Authentication required."}), 401

    @jwt.invalid_token_loader
    def invalid_token(_reason):
        return jsonify({"error": "Invalid token."}), 401

    @jwt.expired_token_loader
    def expired_token(_header, _payload):
        return jsonify({"error": "Token expired. Log in again."}), 401

    if app.config.get("AUTO_CREATE_DB", True):
        with app.app_context():
            import models  # noqa: F401
            db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=app.config["BACKEND_PORT"],
        debug=True,
        use_reloader=False,
    )
