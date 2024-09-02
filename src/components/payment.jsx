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
  const { user, token } = location.state?.key || {};
  const navigate = useNavigate();

  // const initialOptions = {
  //   "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  //   currency: "USD",
  //   intent: "subscription",
  // };

  useEffect(() => {
    if (!user) {
      navigate("/");
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

        chrome.windows.create(
          {
            url: `${import.meta.env.VITE_PAYMENT_SERVICE}/?token=${token}`,
            type: "popup",
            width: 500,
            height: 600,
          },
          (window) => {
            // You can handle the newly created window here if needed
          }
        );
      }
    };

    checkSubscriptionStatus();

    // Add message listener
    const messageListener = (message) => {
      if (message.type === "PAYMENT_SUCCESS") {
        console.log("Payment successful");
        // Update user subscription status
        fetch(import.meta.env.VITE_PYTHON_SERVICE + "/user_subscribed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
          }),
        }).then(() => {
          navigate("/notepad");
        });
      } else if (message.type === "PAYMENT_FAILURE") {
        console.error("Payment failed:", message.error);
        chrome.notifications.create({
          type: "basic",
          title: "Payment Failed",
          message: "Payment failed. Please try again.",
        });
      }
    };

    // Add the listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Remove the listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
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
        <div className="flex justify-center items-center h-full mt-20">
          <p className="text-white text-3xl font-bold">
            $9<span className="text-sm">/month</span>
          </p>
        </div>
        <button
          className="bg-[#facc15] hover:bg-[#facc15]/90 text-black px-4 py-2 rounded-md flex items-center font-medium shadow-md border border-black mt-10 mx-auto"
          onClick={() => {
            chrome.windows.create(
              {
                url: `${import.meta.env.VITE_PAYMENT_SERVICE}/?token=${token}`,
                type: "popup",
                width: 500,
                height: 600,
              },
              (window) => {
                // You can handle the newly created window here if needed
              }
            );
          }}
        >
          Subscribe
        </button>
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
