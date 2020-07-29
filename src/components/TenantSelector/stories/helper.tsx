// Copyright 2020 Cognite AS
import { PureObject } from '../../../interfaces';

export const onTenantSelected = (
  tenant: string,
  advancedOptions: PureObject | null
) => console.log('tenant, advancedOptions', tenant, advancedOptions);

export const validateTenantFailed = async (tenant: string) => {
  throw new Error(tenant);
};

export const inputBehaviorOptions = {
  hasFeedback: false,
  extra: 'Speak and ye shall enter',
};

export const validateTenantSuccess = async () => true;

export const validateTenantForever = () => Promise.race([]);

export const advancedOptionsProps = { apiUrl: '', comment: 'Comment' };

export const customStyle = {
  title: {
    color: 'red',
    alignSelf: 'center',
    fontFamily: 'Comic Sans MS',
  },
  subTitle: {
    color: 'purple',
    alignSelf: 'center',
  },
  wrapper: {
    width: 400,
    backgroundColor: '#ffffa7',
    borderRadius: 30,
    boxShadow: 'none',
  },
  button: {
    width: 200,
    textTransform: 'none',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'magenta',
    color: 'white',
  },
  input: {
    borderRadius: 10,
    border: '2px solid #33DD33',
  },
  collapseWrapper: {
    backgroundColor: '#ffffa7',
  },
};

export const themeExample = {
  gearbox: {
    primaryColor: 'orange',
    textColor: '#999',
    containerColor: '#F4F4F4',
    lightGrey: 'white',
    buttonDisabledColor: '#DDD',
    lightShadow: 'rgba(0, 0, 0, 0.15) 10px 10px 8px 8px',
  },
};
