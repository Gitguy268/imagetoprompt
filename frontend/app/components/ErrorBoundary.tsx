'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  onRetry?: () => void;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" role="alert" aria-live="assertive">
          <h2>Something went wrong. Please try again.</h2>
          <div className="row">
            <button className="btn btnPrimary" type="button" onClick={this.handleRetry}>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
