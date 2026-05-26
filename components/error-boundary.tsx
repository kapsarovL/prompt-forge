"use client"

import React from "react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const errorMessage = this.state.error?.message ?? "Unknown error";
            return (
                <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4" role="alert">
                    <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 overflow-auto">
                            <p className="text-sm text-zinc-300 font-mono whitespace-pre-wrap wrap-break-word">
                                {errorMessage}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}