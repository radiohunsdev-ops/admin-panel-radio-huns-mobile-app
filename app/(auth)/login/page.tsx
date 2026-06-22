"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Loader2,
  Lock,
  Mail,
  Radio,
} from "lucide-react";

import { COLORS } from "@/constants/colors";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Login failed"
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md overflow-hidden rounded-4xl border shadow-2xl"
      style={{
        backgroundColor:
          COLORS.card,
        borderColor:
          COLORS.border,
      }}
    >
      <div
        className="h-2 w-full"
        style={{
          background:
            "linear-gradient(to right, #F2B24D, #A44A07)",
        }}
      />

      <div className="p-8">
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
            style={{
              background:
                "linear-gradient(to bottom right, #F2B24D, #A44A07)",
            }}
          >
            <Radio className="h-10 w-10 text-black" />
          </div>

          <h1
            className="text-3xl font-bold"
            style={{
              color:
                COLORS.text,
            }}
          >
            Welcome Back
          </h1>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor:
                  COLORS.border,
                backgroundColor:
                  COLORS.softCard,
              }}
            >
              <Mail
                className="h-5 w-5"
                style={{
                  color:
                    COLORS.primary,
                }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
                placeholder="Email"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor:
                  COLORS.border,
                backgroundColor:
                  COLORS.softCard,
              }}
            >
              <Lock
                className="h-5 w-5"
                style={{
                  color:
                    COLORS.primary,
                }}
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                placeholder="Password"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold"
            style={{
              background:
                "linear-gradient(to right, #F2B24D, #A44A07)",
              color: "#000",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}