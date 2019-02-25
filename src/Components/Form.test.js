import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import { initializeFirebase } from '../firebase';

import Form from './Form';

configure({ adapter: new Adapter() });

describe('src/Components/Form', () => {
  it('should render', () => {
    initializeFirebase();
    const component = renderer.create(
      <Form
        initialValues={{
          data: {
            asset: 'BTC',
            amount: '600',
            action: 'above',
            currency: 'USD',
            email: 'itsme@contact.com',
          },
        }}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render the Edition From when there are initial values', () => {
    const form = mount(
      <Form
        initialValues={{
          data: {
            asset: 'BTC',
            amount: '600',
            action: 'above',
            currency: 'USD',
            email: 'itsme@contact.com',
          },
        }}
      />
    );
    expect(form.find('.FormEdit')).toHaveLength(1);
    expect(form.find('.FormCreate')).toHaveLength(0);
  });

  it('should render the Creation From when there are no initial values', () => {
    const form = mount(<Form />);
    expect(form.find('.FormCreate')).toHaveLength(1);
    expect(form.find('.FormEdit')).toHaveLength(0);
  });
});
