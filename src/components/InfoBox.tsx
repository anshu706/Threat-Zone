import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  title?: string;
}

/** Plain-language helper text — one idea per box */
export const InfoBox: React.FC<InfoBoxProps> = ({ children, title }) => (
  <div className="ca-info-box" role="note">
    {title && <p className="ca-info-box-title">{title}</p>}
    <p className="ca-info-box-text">{children}</p>
  </div>
);
