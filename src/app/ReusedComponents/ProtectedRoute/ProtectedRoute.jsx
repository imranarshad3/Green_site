import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default ProtectedRoute;
