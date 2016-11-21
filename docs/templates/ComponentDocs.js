/* @flow */

import React from 'react';
import css from 'next/css';
import mono from './styles/mono';
import body from './styles/body';

const wrapper = css({
  padding: '24px 48px',
});

const name = css({
  fontSize: '36px',
  margin: '16px 0 16px -24px',
});

const propsHeader = css({
  fontSize: '24px',
  color: '#000',
  margin: '36px 0 16px',
});

const propInfo = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const propLabel = css({
  backgroundColor: '#f0f0f0',
  borderRadius: '3px',
  padding: '0 8px',
  margin: '8px 16px 8px 0',
});

export default function ComponentDocs(props: any) {
  return (
    <div {...wrapper}>
      <div {...mono} {...name}>{`<${props.name} />`}</div>
      <div {...body}>{props.info.description}</div>
      <div {...mono} {...propsHeader}>Props</div>
      {Object.keys(props.info.props).map(prop => (
        <div {...propInfo} key={prop}>
          <div {...mono} {...propLabel}>{prop}: {props.info.props[prop].flowType.name}</div>
          <div {...body}>{props.info.props[prop].description}</div>
        </div>
      ))}
    </div>
  );
}
