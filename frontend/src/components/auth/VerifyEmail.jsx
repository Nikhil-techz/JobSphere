import { CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  const isSuccess = status === "success";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
          {isSuccess ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-11 w-11 text-green-600" />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Email Verified Successfully!
              </h1>

              <p className="mt-3 text-gray-600">
                Your email address has been verified successfully.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Your JobSphere account is now ready to use.
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
              >
                Continue to Login
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <span className="text-4xl text-red-600">!</span>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Verification Failed
              </h1>

              <p className="mt-3 text-gray-600">
                This verification link is invalid or has expired.
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to Login
              </Link>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} JobSphere
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
