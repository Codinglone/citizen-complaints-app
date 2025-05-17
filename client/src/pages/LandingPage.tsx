import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, login } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://placehold.co/1920x1080/2a303c/ffffff?text=Citizen+Engagement)' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md md:max-w-2xl">
            <h1 className="mb-5 text-5xl font-bold">{t('landing.hero.title')}</h1>
            <p className="mb-8 text-xl">{t('landing.hero.subtitle')}</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard/submit" className="btn btn-primary">
                  {t('landing.submitComplaint')}
                </Link>
              ) : (
                <>
                  <button onClick={() => login()} className="btn btn-primary">
                    {t('landing.signIn')}
                  </button>
                  <Link to="/submit-complaint" className="btn btn-outline btn-secondary">
                    {t('landing.submitAnonymously')}
                  </Link>
                </>
              )}
              <button onClick={toggleLanguage} className="btn btn-outline">
                {i18n.language === 'en' ? '🇫🇷 Français' : '🇺🇸 English'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">{t('landing.features.title')}</h2>
          <p className="text-xl">{t('landing.features.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="https://placehold.co/300x200/4338ca/ffffff?text=AI+Routing" alt="AI Routing" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{t('landing.features.ai.title')}</h2>
              <p>{t('landing.features.ai.description')}</p>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="https://placehold.co/300x200/047857/ffffff?text=Tracking" alt="Real-time Tracking" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{t('landing.features.tracking.title')}</h2>
              <p>{t('landing.features.tracking.description')}</p>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="https://placehold.co/300x200/7e22ce/ffffff?text=Analytics" alt="Data Analytics" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{t('landing.features.analytics.title')}</h2>
              <p>{t('landing.features.analytics.description')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16 bg-base-200">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">{t('landing.howItWorks.title')}</h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <ul className="steps steps-vertical md:steps-horizontal w-full">
            <li className="step step-primary">
              <div className="mt-4">
                <h3 className="font-bold text-lg">{t('landing.howItWorks.step1')}</h3>
              </div>
            </li>
            <li className="step step-primary">
              <div className="mt-4">
                <h3 className="font-bold text-lg">{t('landing.howItWorks.step2')}</h3>
              </div>
            </li>
            <li className="step step-primary">
              <div className="mt-4">
                <h3 className="font-bold text-lg">{t('landing.howItWorks.step3')}</h3>
              </div>
            </li>
            <li className="step">
              <div className="mt-4">
                <h3 className="font-bold text-lg">{t('landing.howItWorks.step4')}</h3>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">{t('landing.testimonials.title')}</h2>
          <p className="text-xl">{t('landing.testimonials.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://placehold.co/100x100/2a303c/ffffff?text=JD" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">John Doe</h3>
                  <p className="text-sm">Community Member</p>
                </div>
              </div>
              <p>"I reported a pothole on my street and it was fixed within a week. The tracking feature kept me updated throughout the process."</p>
              <div className="flex mt-4">
                <div className="rating">
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://placehold.co/100x100/2a303c/ffffff?text=JS" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Jane Smith</h3>
                  <p className="text-sm">Business Owner</p>
                </div>
              </div>
              <p>"The platform made it easy to report noise complaints from a nearby construction site. City officials responded quickly and addressed the issue."</p>
              <div className="flex mt-4">
                <div className="rating">
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked readOnly />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://placehold.co/100x100/2a303c/ffffff?text=RJ" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Robert Johnson</h3>
                  <p className="text-sm">Retired Teacher</p>
                </div>
              </div>
              <p>"As a senior citizen, I appreciate how simple it is to submit complaints online. It's much better than calling different departments and waiting on hold."</p>
              <div className="flex mt-4">
                <div className="rating">
                  <input type="radio" name="rating-3" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-3" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-3" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-3" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  <input type="radio" name="rating-3" className="mask mask-star-2 bg-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="hero py-16 bg-primary text-primary-content">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">{t('landing.cta.title')}</h2>
            <p className="text-xl mb-8">{t('landing.cta.subtitle')}</p>
            <Link to="/signin" className="btn btn-lg">
              {t('landing.cta.button')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-base-300 text-base-content">
        {/* Main footer content */}
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-auto mb-8 md:mb-0">
              <h2 className="font-bold text-2xl mb-4">{t('app.title')}</h2>
              <p className="max-w-md opacity-75">
                Making civic engagement easier through digital tools. Report issues in your community and follow their resolution.
              </p>
              <div className="mt-6">
                <button onClick={toggleLanguage} className="btn btn-sm btn-outline gap-2">
                  {i18n.language === 'en' ? (
                    <>🇫🇷 Français</>
                  ) : (
                    <>🇺🇸 English</>
                  )}
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-wrap gap-x-12 gap-y-8">
              {/* Services column */}
              <div>
                <span className="footer-title">{t('footer.services')}</span>
                <div className="flex gap-x-6 mt-3">
                  <Link to="/dashboard/submit" className="link link-hover">{t('nav.submitComplaint')}</Link>
                  <Link to="/dashboard/complaints" className="link link-hover">{t('footer.trackStatus')}</Link>
                  <Link to="/dashboard" className="link link-hover">{t('footer.viewDashboard')}</Link>
                  <a className="link link-hover">{t('footer.contactSupport')}</a>
                </div>
              </div>
              
              {/* About column */}
              <div>
                <span className="footer-title">{t('footer.about')}</span>
                <div className="flex gap-x-6 mt-3">
                  <a className="link link-hover">{t('footer.howItWorks')}</a>
                  <a className="link link-hover">{t('footer.team')}</a>
                  <a className="link link-hover">{t('footer.press')}</a>
                  <a className="link link-hover">{t('footer.faq')}</a>
                </div>
              </div>
              
              {/* Legal column */}
              <div>
                <span className="footer-title">{t('footer.legal')}</span>
                <div className="flex gap-x-6 mt-3">
                  <a className="link link-hover">{t('footer.terms')}</a>
                  <a className="link link-hover">{t('footer.privacy')}</a>
                  <a className="link link-hover">{t('footer.cookies')}</a>
                </div>
              </div>
            </div>
            
            {/* Social media */}
            <div className="w-full md:w-auto mt-8 md:mt-0">
              <span className="footer-title">{t('footer.social')}</span>
              <div className="flex gap-4 mt-3">
                <a className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
                <a className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright footer */}
        <div className="border-t border-base-content border-opacity-10">
          <div className="container mx-auto px-6 py-4 text-center">
            <p>Copyright © {new Date().getFullYear()} - {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};