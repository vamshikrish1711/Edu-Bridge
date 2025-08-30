from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from mongoengine import connect, disconnect
from .config import Config

jwt = JWTManager()
bcrypt = Bcrypt()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    
    # Configure CORS properly
    CORS(app, 
         origins=["http://localhost:3000", "http://localhost:1625", "http://localhost:5173"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         supports_credentials=True)

    # Connect to MongoDB
    try:
        connect(
            db=app.config['MONGODB_DATABASE'],
            host=app.config['MONGODB_URI']
        )
        print(f"✅ Connected to MongoDB: {app.config['MONGODB_DATABASE']}")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("Make sure MongoDB is running and accessible")

    # JWT Identity function
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user.id)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        from .models import User
        return User.objects(id=identity).first()

    # Import and register blueprints
    from .routes.auth import auth_bp
    from .routes.campaigns import campaigns_bp
    from .routes.users import users_bp
    from .routes.donations import donations_bp
    from .routes.mentors import mentors_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(campaigns_bp, url_prefix='/api/campaigns')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(donations_bp, url_prefix='/api/donations')
    app.register_blueprint(mentors_bp, url_prefix='/api/mentors')

    @app.route('/')
    def root():
        return jsonify({
            'message': 'EduBridge API',
            'version': '1.0.0',
            'database': 'MongoDB',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth',
                'campaigns': '/api/campaigns',
                'users': '/api/users',
                'donations': '/api/donations',
                'mentors': '/api/mentors'
            }
        })

    @app.route('/api/health')
    def health_check():
        try:
            # Test MongoDB connection
            from .models import User
            User.objects.count()
            return {'status': 'healthy', 'message': 'EduBridge API is running', 'database': 'MongoDB'}
        except Exception as e:
            return {'status': 'unhealthy', 'message': f'Database connection failed: {str(e)}', 'database': 'MongoDB'}, 500

    @app.teardown_appcontext
    def close_db(error):
        # MongoDB connections are handled automatically by mongoengine
        pass

    return app
