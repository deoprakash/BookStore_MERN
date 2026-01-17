import React, { useState } from 'react'
import { contactPageStyles as styles, toastStyle } from '../assets/dummystyles'
import { AlertCircle, CheckCircle, MapPin, Mail, Phone, User, MessageSquare, Send } from 'lucide-react'

const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState({visible: false, message: "", type: "info"})

  const validateForm = () => {
    const newErrors = {}
    if(!formData.name.trim()) newErrors.name = "Name is required"
    if(!formData.email.trim()) newErrors.email = "Email is required"
    if(!formData.message.trim()) newErrors.message = "Message is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // FUNCTION SUBMIT DATA & REDIRECT US TO WHATSAPP WEB WITH THAT DATA
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateForm()) return

    const whatsappNumber = '62036082218'
    const textLines = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.phone && `Phone: ${formData.phone}`,
      formData.subject && `Subject: ${formData.subject}`,
      `Message: ${formData.message}`,
    ].filter(Boolean)
    const text = textLines.join("\n")

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setFormData({name: "", email: "", phone: "", subject: "", message: ""})
    setErrors({})
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))

    if(errors[name]) setErrors(prev => ({...prev, [name]: "" }))
  }

  return (
    <div className={styles.containerStyle}>
      {toast.visible && (
        <div className={styles.toastStyle(toast.type)}>
          {toast.type === 'success' ? (
            <CheckCircle className='h-5 w-5 mr-2' />
          ) : (
            <AlertCircle className='h-5 w-5 mr-2' />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className='container mx-auto px-4 md:px-6'>
        <div className={styles.headerStyle}>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Contact Us</h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className={styles.contactInfoCardStyle}>
            <h2 className={styles.sectionHeadingStyle}>Contact Information</h2>

            <div className='space-y-6'>
              <div className={styles.contactItemStyle}>
                <MapPin className='h-6 w-6 text-[#43C6AC]' />
                <div>
                  <h3 className='font-medium text-gray-800 mb-1'>Our Location</h3>
                  <p className='text-gray-600'>123 Book Street, Library City, LC 100001</p>
                </div>
              </div>

              <div className={styles.contactItemStyle}>
                <Mail className='h-6 w-6 text-[#43C6AC]' />
                <div>
                  <h3 className='font-medium text-gray-800 mb-1'>Email</h3>
                  <p className='text-gray-600'>contact@gmail.com</p>
                </div>
              </div>

              <div className={styles.contactItemStyle}>
                <Phone className='h-6 w-6 text-[#43C6AC]' />
                <div>
                  <h3 className='font-medium text-gray-800 mb-1'>Call Us</h3>
                  <p className='text-gray-600'>+91 6203608218</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className={styles.contactFormCardStyle}>
            <h2 className={styles.sectionHeadingStyle}> Send us a message via whatsapp</h2>

            <form onSubmit={handleSubmit} className=' space-y-6'>
              <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
                {['name', 'email'].map((field) => (
                  <div className=' space-y-2' key={field}>
                    <label className={styles.labelStyle}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      <span className='text-red-500'>*</span>
                    </label>

                    <div className={styles.inputWrapperStyle}>
                      {field === 'name' ? (
                        <User className=' absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      ) : (
                        <Mail className=' absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      )}

                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field} 
                        value={formData[field]} onChange={handleChange} className={styles.inputStyle} />

                    {errors[field] && <p className={styles.errorTextStyle}>{errors[field]}</p>}
                  </div>
                  </div>
                ))}
              

              <div className='space-y-2'>
                <label className={styles.labelStyle}>
                  Phone <span className='text-gray-500'> (Optional)</span>
                </label>
                <div className={styles.inputWrapperStyle}>
                  <Phone className=' absolute left-3 top-3 h-5 w-5 text-gray-400 h-5 w-5' />
                  <input
                    type='tel'name='phone' value={formData.phone}
                    onChange={handleChange} className={styles.inputStyle} />
                </div>
              </div>

              <div className='space-y-2'>
                <label className={styles.labelStyle}>
                  Subject <span className='text-gray-500'> (Optional)</span>
                </label>
                  <input
                    type='text' name='subject' value={formData.subject}
                    onChange={handleChange} className={styles.inputStyle} />
              </div>

            </div>

                <div className=' space-y-2'>
                <label className={styles.labelStyle}>
                  Message <span className=' text-red-500'>*</span>
                </label>
                <div className={styles.inputWrapperStyle}>
                  <MessageSquare className=' absolute left-3 top-3 text-gray-400 h-5 w-5' />
                  <textarea
                    name='message' rows='4' value={formData.message}
                    onChange={handleChange} className={styles.inputStyle} />
                {errors.message && <p className={styles.errorTextStyle}>{errors.message}</p>}
              </div>
            </div>

            <button type='submit' disabled={isSubmitting} className={styles.submitButtonStyle}> 
              <div className={styles.sendIconWrapperStyle}>
                <Send className=' w-5 h-5 mr-2'/>
                Send via WhatsApp
              </div>
              </button> 

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact