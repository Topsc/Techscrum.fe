import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterMainV2.module.scss';
import Icon from '../../../assets/logo.svg';
import { userRegister } from '../../../api/registerV2/registerV2';
import Email from '../../../assets/email.png';

export default function RegisterMainV2() {
  const [company, setCompany] = useState('');
  const [emailRecorder, setEmailRecorder] = useState('');
  const [emailVerifyProcess, setEmailVerifyProcess] = useState(false);

  const handleCompanyChange = (companyName) => {
    setCompany(companyName);
  };

  const handleEmailChange = (email) => {
    setEmailRecorder(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email: emailRecorder, company };
    await userRegister(data);
    setEmailVerifyProcess(true);
  };

  return (
    <div className={styles.registerMainContainer}>
      <img className={styles.techScrumIcon} src={Icon} alt="TechScrum Icon" />
      <form className={styles.registerForm}>
        {emailVerifyProcess && (
          <div className={styles.registerEmailBoxContainer}>
            <div className={styles.emailBoxImgContainer}>
              <img src={Email} alt="Email Icon" className={styles.emailBoxImg} />
            </div>
            <h1 className={styles.emailBoxNotification}>
              Email has been sent, Please check your email
            </h1>
          </div>
        )}
        {!emailVerifyProcess && (
          <>
            <h1 className={styles.registerTitle}>Register To Continue</h1>
            <div className={styles.registerCompany}>
              <input
                className={styles.registerCompanyInput}
                placeholder="Company name"
                type="text"
                name="company"
                onChange={(e) => {
                  handleCompanyChange(e.target.value);
                }}
              />
              <p>.techscrum.com</p>
            </div>
            <input
              placeholder="Enter your email address"
              type="email"
              name="email"
              onChange={(e) => {
                handleEmailChange(e.target.value);
              }}
            />
            <p className={styles.registerPolicy}>
              By registering, I accept the&nbsp;
              <Link to="/terms-of-service" target="_blank" className={styles.registerPolicyLink}>
                TechScrum Terms of Service&nbsp;
              </Link>
              and confirm acceptance of the&nbsp;
              <Link to="/privacy-policy" target="_blank" className={styles.registerPolicyLink}>
                Privacy Policy.
              </Link>
            </p>
            <button
              type="submit"
              className={styles.registerSubmitBtn}
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Register
            </button>
            <div className={styles.registerLoginContainer}>
              <Link to="/login" className={styles.registerLogin}>
                Already have TechScrum Account? Login
              </Link>
            </div>
          </>
        )}
      </form>
      <div className={styles.registerFooter}>
        <p className={styles.registerFooterText}>
          <Link to="/privacy-policy" target="_blank" className={styles.registerFooterTextLink}>
            Privacy Policy
          </Link>
          &nbsp;and&nbsp;
          <Link to="/terms-of-service" target="_blank" className={styles.registerFooterTextLink}>
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
