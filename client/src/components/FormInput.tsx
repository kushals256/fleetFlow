import { type InputHTMLAttributes, type ReactNode } from 'react';
// UI of login and register
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: ReactNode;
}

export function FormInput({ label, error, icon, className = '', id, ...props }: FormInputProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`form-input-wrapper ${className}`} style={{ marginBottom: '1rem' }}>
            <label
                htmlFor={inputId}
                style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)'
                }}
            >
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                {icon && (
                    <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    {...props}
                    style={{
                        ...(props.style as React.CSSProperties),
                        paddingLeft: icon ? '2.5rem' : '1rem',
                        borderColor: error ? 'var(--danger)' : undefined
                    }}
                />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>}
        </div>
    );
}
