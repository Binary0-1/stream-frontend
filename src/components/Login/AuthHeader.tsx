import React from 'react';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">{title}</h1>
            <p className="text-zinc-500">{subtitle}</p>
        </div>
    );
};
