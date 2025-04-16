import { Component } from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(_) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    resetError() {
        this.setState({ hasError: false });
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <h2>Something went wrong.</h2>
                    <Link onClick={this.resetError} to={"/"}>
                        Return to home
                    </Link>
                </>
            );
        }

        return this.props.children;
    }
}