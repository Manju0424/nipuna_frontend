import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('NIPUNA');
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Add slight delay to ensure DOM is ready
      setTimeout(() => {
        this.initScrollAnimations();
        this.initMobileMenu();
        this.initNewsletterSubscription();
        this.initSmoothScroll();
        this.initContactForm();
        this.initPostsFilter();
        this.initChatbot();
        this.initGlobalFunctions();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  private initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
    animatedElements.forEach((el) => observer.observe(el));

    // Add scroll listener for parallax effects
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  private handleScroll = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Apply parallax effect to hero background
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.style.transform = `translateY(${rate}px)`;
    }

    // Update navbar background on scroll
    const navbar = document.querySelector('nav');
    if (navbar) {
      if (scrolled > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  private initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle') as HTMLElement;
    const mobileMenu = document.getElementById('mobile-menu') as HTMLElement;
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.style.display === 'none' || !mobileMenu.style.display;
        if (isHidden) {
          mobileMenu.style.display = 'block';
          mobileMenuButton.setAttribute('aria-expanded', 'true');
        } else {
          mobileMenu.style.display = 'none';
          mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
      });

      // Close mobile menu when clicking on links
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileMenu.style.display = 'none';
          mobileMenuButton.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }


  private initNewsletterSubscription() {
    const newsletterForm = document.getElementById('newsletter-form') as HTMLFormElement;
    const newsletterMessage = document.getElementById('newsletter-message') as HTMLElement;
    
    if (newsletterForm && newsletterMessage) {
      newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email') as HTMLInputElement;
        const email = emailInput.value.trim();
        
        if (!email) {
          newsletterMessage.textContent = 'Please enter a valid email address.';
          newsletterMessage.style.color = '#dc2626';
          newsletterMessage.style.display = 'block';
          return;
        }

        try {
          // Show loading state
          const submitBtn = newsletterForm.querySelector('button') as HTMLButtonElement;
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Subscribing...';
          submitBtn.disabled = true;

          // Simulate API call (replace with actual API endpoint)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Show success message
          newsletterMessage.textContent = 'Thank you for subscribing to our newsletter!';
          newsletterMessage.style.color = '#10b981';
          newsletterMessage.style.display = 'block';
          
          // Reset form
          emailInput.value = '';
          
          // Reset button
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          
          // Hide message after 5 seconds
          setTimeout(() => {
            newsletterMessage.style.display = 'none';
          }, 5000);
          
        } catch (error) {
          newsletterMessage.textContent = 'Something went wrong. Please try again.';
          newsletterMessage.style.color = '#dc2626';
          newsletterMessage.style.display = 'block';
          
          const submitBtn = newsletterForm.querySelector('button') as HTMLButtonElement;
          submitBtn.textContent = 'Subscribe';
          submitBtn.disabled = false;
        }
      });
    }
  }

  private initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (link as HTMLAnchorElement).getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId!);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  private initContactForm() {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous errors
      this.clearFormErrors();
      
      // Validate form
      if (!this.validateContactForm()) {
        return;
      }
      
      // Show loading state
      const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
      const submitText = document.getElementById('submit-text')!;
      const submitLoading = document.getElementById('submit-loading')!;
      
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      submitLoading.style.display = 'block';
      
      try {
        // Get form data
        const formData = new FormData(form);
        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          preferred_date: formData.get('preferred_date'),
          message: formData.get('message'),
          consent: formData.get('consent') ? true : false
        };
        
        // Send to backend
        const response = await fetch('https://nipuna-backend.onrender.com/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          // Show success message
          form.style.display = 'none';
          const successMessage = document.getElementById('success-message')!;
          successMessage.style.display = 'block';
          
          // Reset form after delay
          setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Failed to submit form');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your request. Please try again.');
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitText.style.display = 'block';
        submitLoading.style.display = 'none';
      }
    });
  }

  private validateContactForm(): boolean {
    let isValid = true;
    
    // Validate name
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    if (!name) {
      this.showFieldError('name', 'Name is required');
      isValid = false;
    }
    
    // Validate email
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      this.showFieldError('email', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      this.showFieldError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate phone
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    if (!phone) {
      this.showFieldError('phone', 'Phone number is required');
      isValid = false;
    }
    
    // Validate message
    const message = (document.getElementById('message') as HTMLTextAreaElement).value.trim();
    if (!message) {
      this.showFieldError('message', 'Message is required');
      isValid = false;
    }
    
    // Validate consent
    const consent = (document.getElementById('consent') as HTMLInputElement).checked;
    if (!consent) {
      this.showFieldError('consent', 'You must agree to be contacted');
      isValid = false;
    }
    
    return isValid;
  }

  private showFieldError(fieldId: string, message: string) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
      inputElement.style.borderColor = 'var(--primary-red)';
    }
  }

  private clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll('#contact-form input, #contact-form textarea');
    inputElements.forEach((element) => {
      (element as HTMLElement).style.borderColor = '#d1d5db';
    });
  }

  private initPostsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const postItems = document.querySelectorAll('.post-item');
    
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = (button as HTMLElement).getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach((btn) => {
          btn.classList.remove('active');
          (btn as HTMLElement).style.backgroundColor = 'transparent';
          (btn as HTMLElement).style.color = '#4b5563';
        });
        
        button.classList.add('active');
        (button as HTMLElement).style.backgroundColor = 'var(--primary-red)';
        (button as HTMLElement).style.color = 'white';
        
        // Filter posts
        postItems.forEach((post) => {
          const category = (post as HTMLElement).getAttribute('data-category');
          if (filter === 'All' || category === filter) {
            (post as HTMLElement).style.display = 'block';
          } else {
            (post as HTMLElement).style.display = 'none';
          }
        });
      });
    });
  }

  private initChatbot() {
    console.log('Initializing chatbot...');
    
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
      const chatbotToggle = document.getElementById('chatbot-toggle');
      const chatbotWindow = document.getElementById('chatbot-window');
      const chatbotClose = document.getElementById('chatbot-close');
      const chatbotInput = document.getElementById('chatbot-input') as HTMLInputElement;
      const chatbotSend = document.getElementById('chatbot-send');
      const chatbotMessages = document.getElementById('chatbot-messages');
      const chatbotTyping = document.getElementById('chatbot-typing');
      
      console.log('Chatbot elements found:', {
        toggle: !!chatbotToggle,
        window: !!chatbotWindow,
        close: !!chatbotClose,
        input: !!chatbotInput,
        send: !!chatbotSend,
        messages: !!chatbotMessages,
        typing: !!chatbotTyping
      });
      
      if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotInput || !chatbotSend || !chatbotMessages) {
        console.error('Chatbot elements not found. Available elements:', {
          allElements: document.querySelectorAll('[id*="chatbot"]').length,
          container: !!document.getElementById('chatbot-container')
        });
        return;
      }
      
      let isOpen = false;
      
      // Toggle chatbot window
      chatbotToggle.addEventListener('click', () => {
        console.log('Chatbot toggle clicked, current state:', isOpen);
        isOpen = !isOpen;
        if (isOpen) {
          chatbotWindow.classList.add('active');
          console.log('Chatbot window opened');
          setTimeout(() => chatbotInput.focus(), 300);
        } else {
          chatbotWindow.classList.remove('active');
          console.log('Chatbot window closed');
        }
      });
      
      // Close chatbot
      chatbotClose.addEventListener('click', () => {
        console.log('Chatbot close button clicked');
        isOpen = false;
        chatbotWindow.classList.remove('active');
      });
      
      // Send message function
      const sendMessage = async () => {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        console.log('Sending message:', message);
        
        // Add user message to chat
        this.addChatMessage(message, 'user');
        chatbotInput.value = '';
        
        // Show typing indicator
        if (chatbotTyping) {
          chatbotTyping.style.display = 'flex';
        }
        
        try {
          // Send to backend AI
          const response = await fetch('https://nipuna-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('AI response received:', data);
            // Hide typing indicator
            if (chatbotTyping) {
              chatbotTyping.style.display = 'none';
            }
            // Add AI response
            this.addChatMessage(data.response, 'bot');
          } else {
            throw new Error('Failed to get AI response');
          }
        } catch (error) {
          console.error('Chat error:', error);
          // Hide typing indicator
          if (chatbotTyping) {
            chatbotTyping.style.display = 'none';
          }
          // Add error message
          this.addChatMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
        }
      };
      
      // Send button click
      chatbotSend.addEventListener('click', sendMessage);
      
      // Enter key press
      chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });
      
      // Close chatbot when clicking outside
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (isOpen && !chatbotWindow.contains(target) && !chatbotToggle.contains(target)) {
          isOpen = false;
          chatbotWindow.classList.remove('active');
        }
      });
      
      console.log('Chatbot initialization complete');
    }, 200); // Small delay to ensure DOM is ready
  }

  private initGlobalFunctions() {
    // Make functions globally available
    (window as any).openGoogleMaps = this.openGoogleMaps.bind(this);
  }

  private openGoogleMaps() {
    const address = "7-2-A2, Industrial Estates, Sarath Nagar, Hyderabad-530018, Telangana, India";
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  }

  
  private addChatMessage(message: string, type: 'user' | 'bot') {
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (!chatbotMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    messageDiv.innerHTML = `
      <div class="message-content">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <div class="message-time">${timeString}</div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}
