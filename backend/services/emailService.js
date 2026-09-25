/**
 * Email Service for Campus Skill Network
 * Handles simulated or real email verification for college students
 */
const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  
  console.log('--------------------------------------------------');
  console.log(`✉️ [EMAIL SERVICE] Verification sent to: ${email}`);
  console.log(`🔗 Verification link: ${verificationLink}`);
  console.log(`🔑 Verification token: ${token}`);
  console.log('--------------------------------------------------');

  // If SMTP credentials exist in env, real email can be dispatched here.
  return { success: true, verificationLink, token };
};

const sendPasswordResetEmail = async (email, resetToken) => {
  console.log(`✉️ [EMAIL SERVICE] Password reset dispatched for: ${email}`);
  console.log(`🔑 Reset Token: ${resetToken}`);
  return { success: true };
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
