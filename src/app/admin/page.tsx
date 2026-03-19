"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [checking, setChecking] = useState(true);
	const router = useRouter();

	// Check if already logged in
	useEffect(() => {
		fetch("/api/auth/me")
			.then((r) => r.json())
			.then((data) => {
				if (data.authenticated) {
					router.replace("/admin/dashboard");
				}
				setChecking(false);
			})
			.catch(() => setChecking(false));
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Login failed");
				setLoading(false);
				return;
			}

			router.push("/admin/dashboard");
		} catch {
			setError("Network error. Please try again.");
			setLoading(false);
		}
	};

	if (checking) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-6 h-6 border-2 border-[#c9a87c] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-6">
			{/* Background effects */}
			<div
				className="fixed w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, rgba(201,168,124,0.08) 0%, transparent 70%)",
					top: "20%",
					left: "30%",
				}}
			/>

			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="text-center mb-10">
					<div className="w-16 h-16 rounded-full border-2 border-[#c9a87c]/60 flex items-center justify-center mx-auto mb-4">
						<span className="text-xl font-bold tracking-wider text-[#c9a87c]">
							M
						</span>
					</div>
					<h1 className="text-2xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb]">
						Admin Portal
					</h1>
					<p className="text-sm text-[#6b6560] mt-1">
						MBM — Meena Bisht Makeup
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#111111] p-8"
				>
					{error && (
						<div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							{error}
						</div>
					)}

					<div className="mb-5">
						<label
							htmlFor="email"
							className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm placeholder:text-[#3a3530] focus:outline-none focus:border-[#c9a87c]/40 transition-colors duration-300"
							placeholder="enter admin email"
							required
						/>
					</div>

					<div className="mb-8">
						<label
							htmlFor="password"
							className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm placeholder:text-[#3a3530] focus:outline-none focus:border-[#c9a87c]/40 transition-colors duration-300"
							placeholder="••••••••"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-3.5 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[#e8d5b7] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<span className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
								Signing in...
							</span>
						) : (
							"Sign In"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
