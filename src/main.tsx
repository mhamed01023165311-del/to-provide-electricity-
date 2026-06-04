import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// كود سحري لمراقبة الأخطاء وعرضها على الشاشة مباشرة بدل الشاشة البيضاء
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("VoltSync Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', direction: 'rtl', textAlign: 'right', fontFamily: 'sans-serif', borderRadius: '10px', margin: '20px', border: '1px solid #fca5a5' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>🚨 قفشة! حصل خطأ خفي موقف الشاشة:</h2>
          <pre style={{ background: '#fff', padding: '15px', borderRadius: '5px', overflow: 'auto', border: '1px solid #fee2e2', color: '#000' }}>
            {this.state.error?.toString() || 'خطأ غير معروف'}
          </pre>
          <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '10px' }}>انسخ الكلام اللي فوق ده وابعتهولي حالا عشان نقتله!</p>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
