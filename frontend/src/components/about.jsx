import React, { useState, useEffect } from 'react'
import aboutStyles from '../assets/dummystyles'
import { apstats } from '../assets/dummydata'
import AboutUsImage from '../assets/AboutUsImage.png'
import { Mail, Linkedin } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const MemberAvatar = ({ photo, name }) => {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  if (photo) {
    return <img src={`${API_BASE}${photo}`} alt={name} className={aboutStyles.teamImage} />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#43C6AC] to-[#2B5876] text-white text-4xl font-bold">
      {initials}
    </div>
  );
};

const About = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/team?isActive=true`);
        const data = await res.json();
        setTeamMembers(data);
      } catch (err) {
        console.error('Failed to load team:', err);
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className={aboutStyles.container}>
      <section className={aboutStyles.section}>
        <div className={aboutStyles.innerContainer}>
          <div className={aboutStyles.headingWrapper}>
            <div className=' relative inline-block'>
                <h1 className={aboutStyles.heading}>
                   Crafting Literary <br /> Futures 
                </h1>
                <div className={aboutStyles.underline} />
            </div>
            <p className={aboutStyles.subText}>
              Pioneering the next chapter in global storytelling. We bridge imagination with 
              innovation through curated literary experiences.
            </p>
          </div>
        </div> 
      </section>

      {/*STATS SECTION*/}
        <section className={aboutStyles.statsSection}>
          <div className={aboutStyles.innerContainer}>
              <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>

                {apstats.map((stat, index) => (
                  <div key={index} className={aboutStyles.statCard}>
                    <div className={aboutStyles.statIconWrapper}>
                      <stat.icon className=' h-8 w-8 text-white' />
                    </div>
                      <h3 className={aboutStyles.statValue}>{stat.value}</h3>
                        <p className={aboutStyles.statLabel}>{stat.label}</p>
                  </div>
                ))}
              </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
          <section className={aboutStyles.aboutSection}>
              <div className={aboutStyles.innerContainer}>
                <div className=' grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
                  <div className={aboutStyles.aboutImageWrapper}>  
                    <img src={AboutUsImage} alt="About" className={aboutStyles.aboutImage} />
                    <div className={aboutStyles.aboutOverlay} />

                    <div className={aboutStyles.aboutCaption}>
                      <h3 className={aboutStyles.aboutTitle}>Since 2023</h3>
                      <p className={aboutStyles.aboutSubtitle}>Pioneering Digital Literature</p>
                    </div>
                  </div>

                    <div className={aboutStyles.aboutTextSection}> 
                      <div className={aboutStyles.aboutHeadingSection}>
                        <h2 className={aboutStyles.aboutHeading}>Redefining Storytelling</h2>
                        <p className={aboutStyles.aboutParagraph}>We've transformed traditional publishing into a dynamic digital ecosystem...</p>
                      </div>

                      <div className={aboutStyles.aboutBoxGrid}>
                        <div className={aboutStyles.aboutBox}>
                          <h4 className={aboutStyles.aboutBoxHeading}>Our vision</h4>
                          <p className={aboutStyles.aboutBoxText}>Create a global network...</p>
                        </div>

                        <div className={aboutStyles.aboutBox}>
                          <h4 className={aboutStyles.aboutBoxHeading}>Our Mission</h4>
                          <p className={aboutStyles.aboutBoxText}>Empower Creators & Inspire Readers...</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
          </section>

          {/* TEAM SECTION */}
          <section className={aboutStyles.teamSection}>
            <div className={aboutStyles.innerContainer}>
                <div className=' text-center mb-20'>
                  <h2 className={aboutStyles.sectionTitle}>Meet Our Team</h2>
                  <div className={aboutStyles.sectionUnderline} />
                </div>

                {loadingTeam ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="flex gap-2">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full bg-[#43C6AC] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">No team members to display.</p>
                ) : (
                  <div className=' grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {teamMembers.map((member) => (
                      <div 
                        className={aboutStyles.teamCard} 
                        key={member._id}
                        onMouseEnter={() => setHoveredMember(member._id)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className={aboutStyles.teamImageWrapper}>
                          <MemberAvatar photo={member.photo} name={member.name} />
                          <div className={aboutStyles.teamOverlay} />
                          
                          {/* Bio overlay on hover */}
                          {hoveredMember === member._id && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
                              <p className="text-gray-900 text-sm text-center leading-relaxed font-semibold drop-shadow-sm">
                                {member.bio || `${member.role} at BookHub.`}
                              </p>
                            </div>
                          )}
                        </div>
                        <h3 className={aboutStyles.teamName}>{member.name}</h3>
                        <p className={aboutStyles.teamPosition}>{member.role}</p>

                        <div className=' flex justify-center space-x-4'>
                          {member.email && (
                            <a href={`mailto:${member.email}`} className={aboutStyles.socialIcon}>
                              <Mail className=' h-6 w-6' />
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noreferrer" className={aboutStyles.socialIcon}>
                              <Linkedin className=' h-6 w-6' />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </section>
    </div>
  )
}

export default About