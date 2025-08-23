import Navbar from '../../components/Navbar';

const AboutPage = () => {
  const stats = [
    { number: '500+', label: 'Students Helped', icon: '🎓' },
    { number: '100+', label: 'Active Mentors', icon: '👨‍🏫' },
    { number: '50+', label: 'Partner NGOs', icon: '🏢' },
    { number: '$2M+', label: 'Funds Raised', icon: '💰' }
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Community',
      description: 'We believe in the power of community to transform education and create lasting impact.'
    },
    {
      icon: '🎯',
      title: 'Transparency',
      description: 'Every donation and campaign is tracked transparently to ensure accountability and trust.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We continuously innovate to provide better educational opportunities and experiences.'
    },
    {
      icon: '❤️',
      title: 'Empathy',
      description: 'We approach every student and situation with understanding and compassion.'
    }
  ];

  const team = [
    {
      name: 'Vamshi Krishna',
      role: 'FrontEnd Developer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Experienced Web Designer & Developer with Industry Projects.'
    },
    {
      name: 'Sampath',
      role: 'DataBase Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech enthusiast passionate about making education accessible to all.'
    },
    {
      name: 'Bhanu Chandu',
      role: 'BackEnd Developer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Social worker dedicated to bridging educational gaps in rural areas.'
    }
  ];

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              About <span className="text-gradient">EduBridge</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to bridge educational gaps and create opportunities for students 
              who need them most. Through technology, community, and compassion, we're building 
              a brighter future for education.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                EduBridge was founded with a simple yet powerful vision: to make quality education 
                accessible to every student, regardless of their background or circumstances.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                We connect students with mentors, donors, and educational resources through our 
                innovative platform, creating a supportive ecosystem that nurtures learning and growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Learn More
                </button>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Get Involved
                </button>
              </div>
            </div>
            <div className="glass-card p-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white">Innovation in Education</h3>
                <p className="text-white/70">
                  We leverage cutting-edge technology to create seamless connections between 
                  students, mentors, and donors, making education more accessible and effective.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                These core values guide everything we do and shape our approach to education.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="glass-card text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-white/70 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Meet Our <span className="text-gradient">Team</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                The passionate individuals behind EduBridge who are committed to transforming education.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="glass-card text-center group hover:scale-105 transition-transform duration-300">
                  <div className="mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white/20 group-hover:ring-blue-400/40 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-300 mb-3">{member.role}</p>
                  <p className="text-white/70 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-card max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Us in Making a Difference
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Whether you're a student seeking opportunities, a mentor wanting to give back, 
                or a donor looking to make an impact, there's a place for you in the EduBridge community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Get Started Today
                </button>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;