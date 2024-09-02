import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <>
      <div className="size-full text-white">
        <button
          className="absolute top-0 left-0 m-5 flex items-center gap-2"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold w-full text-center">
          Privacy Policy for Noteworthy Ninja
        </h1>
        <b>Effective Date:</b> 03/Sept/2024
        <p>
          Thank you for choosing to use Noteworthy Ninja. This Privacy Policy
          outlines how we collect, use, and protect your personal information
          when you use our Chrome extension.
        </p>
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>
          When you use Noteworthy Ninja, we may collect the following personal
          information from you through Google OAuth 2.0:
        </p>
        <ul className="list-disc list-inside">
          <li>Email Address: Used to identify and communicate with you.</li>
          <li>
            Name: Used to personalize your experience within the extension.
          </li>
          <li>
            Profile Picture: Displayed within the extension for a personalized
            experience.
          </li>
        </ul>
        <h2 className="text-xl font-semibold">
          2. How We Use Your Information
        </h2>
        <p>
          The personal information we collect is used for the following
          purposes:
        </p>
        <ul className="list-disc list-inside">
          <li>
            Authentication: To verify your identity through Google OAuth 2.0.
          </li>
          <li>
            Personalization: To display your name and profile picture within the
            extension.
          </li>
          <li>
            Communication: To send you notifications or updates related to the
            extension.
          </li>
        </ul>
        <h2 className="text-xl font-semibold">3. Data Storage and Security</h2>
        <p>
          We are committed to protecting your personal information. Your data is
          stored securely, and we implement various security measures to ensure
          that your information is not accessed, disclosed, altered, or
          destroyed by unauthorized individuals.
        </p>
        <h2 className="text-xl font-semibold">4. Sharing Your Information</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties.
        </p>
        <h2 className="text-xl font-semibold">5. Your Consent</h2>
        <p>By using Noteworthy Ninja, you consent to our Privacy Policy.</p>
        <h2 className="text-xl font-semibold">
          6. Changes to Our Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
        </p>
        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at `codesakshat@gmail.com`.
        </p>
      </div>
    </>
  );
}
