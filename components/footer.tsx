import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <p>
        <span
          dangerouslySetInnerHTML={{
            __html: t('footer.author1', {
              linkOpen:
                '<a target="_blank" rel="noreferrer" href="https://github.com/beccathomson">',
              linkClose: '</a>',
            }),
          }}
        />{' '}
        {' '}
        <span
          dangerouslySetInnerHTML={{
            __html: t('footer.author2', {
              linkOpen:
                '<a target="_blank" rel="noreferrer" href="https://github.com/kvangorp">',
              linkClose: '</a>',
            }),
          }}
        />
        ·{' '}
        <span
          dangerouslySetInnerHTML={{
            __html: t('footer.github', {
              linkOpen:
                '<a target="_blank" rel="noreferrer" href="https://github.com/JMPerez/spotify-dedup/">',
              linkClose: '</a>',
            }),
          }}
        />
      </p>
      <style jsx>
        {`
          .footer {
            padding-top: 15px;
            padding-left: 15px;
            padding-right: 15px;
            color: var(--secondary-text-color);
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default Footer;
