import React, { useState } from 'react'
import aboutStyles from '../assets/dummystyles'
import { apstats, apteamMembers } from '../assets/dummydata'
import AboutUsImage from '../assets/AboutUsImage.png'
import { Facebook, Instagram, Mail } from 'lucide-react'

const About = () => {
  const [hoveredMember, setHoveredMember] = useState(null)

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

                <div className=' grid grid-cols-1 md:grid-cols-3 gap-8'>
                  {apteamMembers.map((member) => (
                    <div 
                      className={aboutStyles.teamCard} 
                      key={member.id}
                      onMouseEnter={() => setHoveredMember(member.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                    >
                      <div className={aboutStyles.teamImageWrapper}>
                        <img src={member.image} alt={member.name} className={aboutStyles.teamImage} />
                        <div className={aboutStyles.teamOverlay} />
                        
                        {/* About overlay that appears on hover */}
                        {hoveredMember === member.id && (
                          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
                            <p className="text-gray-900 text-sm text-center leading-relaxed font-semibold drop-shadow-sm">
                              {member.about}
                            </p>
                          </div>
                        )}
                      </div>
                      <h3 className={aboutStyles.teamName}>{member.name}</h3>
                      <p className={aboutStyles.teamPosition}>{member.position}</p>

                      <div className=' flex justify-center space-x-4'>
                        {[Mail, Instagram].map((Icon, i) => (
                          <button key={i} className={aboutStyles.socialIcon}>
                            <Icon className=' h-6 w-6' />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>                
            </div>
          </section>
    </div>
  )
}

export default About