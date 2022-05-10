import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import Detail from "./components/Detail/Detail.jsx";
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Provider } from 'react-redux';
Enzyme.configure({ adapter: new Adapter() });

describe('<Detail /> Mounted', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Provider><Detail /></Provider>);
  });
  it('The detail must contain a img tag', () => {
      const { container } = render(<Detail />)
      const element = container.querySelectorAll('img')[0]
      console.log(element.innerHTML);
      expect(element.innerHTML).toBe('Username:');
  });

//   it('El form debe tener un label que diga: "Password:"', () => {
//     const { container } = render(<Form />)
//     const element = container.querySelectorAll('label')[1]
//     expect(element.innerHTML).toBe('Password:');
//   });

//   it('El form debe tener un input con name "username" y type "text"', () => {
//     const { container } = render(<Form />)
//     const element = container.querySelectorAll('input')[0]
//     expect(element.type).toBe('text');
//     expect(element.name).toBe('username');
//   });

//   it('El form debe tener un input con name "password" y type "password"', () => {
//     const { container } = render(<Form />)
//     const element = container.querySelectorAll('input')[1]
//     expect(element.type).toBe('password');
//     expect(element.name).toBe('password');
//   });

//   it('El input de username tiene que tener la clase danger si tiene un error',  () => {
//       wrapper.find('input[name="username"]').simulate('change', {target: {name: 'username', value: 'My new value'}});
//       const ele = wrapper.find('input[name="username"]');
//       expect(ele.hasClass('danger')).toBeTruthy();
//    });
//   it('El input de username NO tiene que tener la clase danger si tiene un usuario correcto',  () => {
//       wrapper.find('input[name="username"]').simulate('change', {target: {name: 'username', value: 'toni@soyhenry.com'}});
//       const ele = wrapper.find('input[name="username"]');

//       expect(ele.hasClass('danger')).toBeFalsy();
//     });
//   it('El input de password tiene que tener la clase danger si tiene un error',  () => {
//       wrapper.find('input[name="password"]').simulate('change', {target: {name: 'password', value: 'My new value'}});
//       const ele = wrapper.find('input[name="username"]');
//       expect(ele.hasClass('danger')).toBeTruthy();
//     });
//   it('El input de password NO tiene que tener la clase danger si tiene un password correcto',  () => {
//       wrapper.find('input[name="password"]').simulate('change', {target: {name: 'password', value: 'hola123'}});
//       const ele = wrapper.find('input[name="password"]');
//       expect(ele.hasClass('danger')).toBeFalsy();
//     });
});