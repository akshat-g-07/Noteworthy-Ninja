import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { getAuthToken, revokeToken } from "../chromeActions";

// async function logout() {
//   try {
//     const token = await getAuthToken();
//     await revokeToken(token);
//     // Clear any stored user data in your extension
//     // For example, if you're using chrome.storage:
//     chrome.storage.local.remove(["userToken", "userInfo"], () => {
//       console.log("User data cleared");
//     });
//     // You might also want to update your UI to reflect the logged out state
//     return true;
//   } catch (error) {
//     console.error("Logout failed:", error);
//     return false;
//   }
// }

export default function Payment() {
  const location = useLocation();
  const { user } = location.state?.key || {};
  const navigate = useNavigate();

  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "subscription",
  };

  useEffect(() => {
    if (!user) {
      navigate("/", {
        state: { key: { error: "not logged in" } },
      });
      return;
    }

    const checkSubscriptionStatus = async () => {
      const checkSubscription = await fetch(
        import.meta.env.VITE_PYTHON_SERVICE + "/check_subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
          }),
        }
      );

      const subscriptionStatus = await checkSubscription.json();

      if (subscriptionStatus.data) {
        navigate("/notepad");
      } else {
        await fetch(import.meta.env.VITE_PYTHON_SERVICE + "/add_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: user.name,
            userEmail: user.email,
            subscribed: "NotSubscribed",
          }),
        });
      }
    };

    checkSubscriptionStatus();
  }, [user, navigate]);

  // const handleLogout = async () => {
  //   const success = await logout();
  //   if (success) {
  //     console.log("Logged out successfully");
  //     // Update your app state or redirect the user
  //   } else {
  //     console.log("Logout failed");
  //   }
  // };

  return (
    <>
      <div className="size-full">
        <div className="w-full h-10 md:h-12 lg:h-14 items-center flex justify-center">
          <img src="/logo.jpeg" className="w-auto h-full mr-2" />
          <p className="w-fit text-white tracking-wider text-3xl md:text-4xl lg:text-5xl font-bold md:font-extrabold lg:font-extrabold">
            Noteworthy Ninja
          </p>
        </div>
        {/* 
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            createSubscription={(data, actions) => {
              return actions.subscription.create({
                plan_id: import.meta.env.VITE_PAYPAL_PLAN_ID, // Create this plan ID in your PayPal dashboard
              });
            }}
            onApprove={(data, actions) => {
              return actions.subscription.get().then(function () {
                fetch(
                  import.meta.env.VITE_PYTHON_SERVICE + "/user_subscribed",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userEmail: user.email,
                    }),
                  }
                );
                navigate("/notepad");
              });
            }}
          />
        </PayPalScriptProvider> */}
      </div>
    </>
    // <div>
    //   <button onClick={handleLogout}>Logout</button>
    //   <div>
    //     <h1>Payment Page</h1>

    //     {user && (
    //       <div>
    //         <p>User Information:</p>
    //         <pre>{JSON.stringify(user, null, 2)}</pre>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}
