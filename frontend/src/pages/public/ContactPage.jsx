import { useState } from 'react';
import Navbar from '../../components/Navbar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submitted:', formData);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Education Street, Tech Park, Bangalore, Karnataka 560001',
      action: 'Get Directions'
    },
    {
      icon: '📧',
      title: 'Email Us',
      details: 'hello@edubridge.com',
      action: 'Send Email'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+91 98765 43210',
      action: 'Call Now'
    }
  ];

  const faqs = [
    {
      question: 'How can I register as a student?',
      answer: 'You can register as a student by clicking the "Get Started" button and selecting "Student" as your role. Fill in your details and you\'ll be connected with relevant opportunities.'
    },
    {
      question: 'How do I become a mentor?',
      answer: 'To become a mentor, register on our platform and select "Mentor" as your role. You\'ll need to provide your professional background and areas of expertise.'
    },
    {
      question: 'Is my donation secure?',
      answer: 'Yes, all donations are processed through secure payment gateways and are fully transparent. You can track how your donation is being used.'
    },
    {
      question: 'How can NGOs create campaigns?',
      answer: 'NGOs can register on our platform and submit campaign proposals. Our team reviews each proposal to ensure quality and impact.'
    }
  ];

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Have questions? Want to get involved? We'd love to hear from you. 
              Reach out to us and let's start a conversation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <div className="glass-card">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="glass-input text-white placeholder-white/50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="glass-input text-white placeholder-white/50"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white/80 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="glass-input text-white placeholder-white/50"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white/80 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="glass-input text-white placeholder-white/50 resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glass-button text-white hover:bg-white hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-3xl">{info.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">{info.title}</h4>
                        <p className="text-white/70 mb-2">{info.details}</p>
                        <button className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors">
                          {info.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <h3 className="text-2xl font-bold text-white mb-6">Office Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Monday - Friday</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Sunday</span>
                    <span className="text-white">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Find answers to common questions about EduBridge and our services.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">Find Us</h3>
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-white/70">Interactive map coming soon</p>
                <p className="text-white/50 text-sm">123 Education Street, Tech Park, Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;