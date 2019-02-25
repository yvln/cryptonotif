import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import { initializeFirebase } from '../firebase';

import Alert from './Alert';

configure({ adapter: new Adapter() });

describe('src/Components/Alert', () => {
  it('should render', () => {
    initializeFirebase();
    const component = renderer.create(
      <Alert
        data={{
          asset: 'BTC',
          amount: '600',
          action: 'above',
          currency: 'USD',
          email: 'itsme@contact.com',
        }}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it("should display 'Loading' when no data props", () => {
    const alert = shallow(<Alert />);
    expect(alert.text()).toEqual('Loading...');
  });

  it('should display an alert when receiving data props', () => {
    const alert = mount(
      <Alert
        data={{
          asset: 'BTC',
          amount: '600',
          action: 'above',
          currency: 'USD',
          email: 'itsme@contact.com',
        }}
      />
    );
    expect(alert.text()).toContain('When BTC is above 600USD');
  });
});
