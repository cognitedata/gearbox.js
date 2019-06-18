import { Button, Form, Icon, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { SyntheticEvent } from 'react';
import { v4 as uuid } from 'uuid';
import {
  AdvancedSearch,
  EmptyCallback,
  OnAdvancedSearchChange,
  PureObject,
} from '../../../../interfaces';

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 15, offset: 1 },
  },
};

const formItemLayoutWithoutLabel = {
  labelCol: {
    sm: { span: 0 },
  },
  wrapperCol: {
    sm: { span: 15, offset: 7 },
  },
};

export const defaultStrings: PureObject = {
  metadataLabel: 'Metadata',
  metadataKey: 'Key',
  metadataValue: 'Value',
  nameField: 'Name',
  descriptionField: 'Description',
  addMetadata: 'Add more metadata to search',
  search: 'Search',
};

export interface SearchFormStyles {
  container?: React.CSSProperties;
  addMoreMetadataButton?: React.CSSProperties;
}

export interface SearchProps {
  form: WrappedFormUtils;
  value: AdvancedSearch | null;
  onChange?: OnAdvancedSearchChange;
  onPressEnter?: EmptyCallback;
  onSubmit?: OnAdvancedSearchChange;
  strings?: PureObject;
  styles?: SearchFormStyles;
}

export interface MetadataField {
  id: number;
  key: string;
  value: string;
}

const SearchForm = ({
  onSubmit,
  form,
  onPressEnter,
  styles,
  strings = {},
}: SearchProps) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const lang = { ...defaultStrings, ...strings };
  const {
    metadataLabel,
    metadataKey,
    metadataValue,
    nameField,
    descriptionField,
    addMetadata,
    search,
  } = lang;

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({ ...form.getFieldsValue() });
    }
  };

  const onAddMetadata = () => {
    const keys = form.getFieldValue('metadata');
    const nextKeys = [...keys, { id: uuid(), key: '', value: '' }];
    form.setFieldsValue({
      metadata: nextKeys,
    });
  };

  const onRemoveMetadata = (id: number) => {
    const keys = form.getFieldValue('metadata');

    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      metadata: keys.filter((data: MetadataField) => data.id !== id),
    });
  };

  const pressEnter = (e: SyntheticEvent) => {
    e.preventDefault();

    if (onPressEnter) {
      onPressEnter();
    }
  };

  const onChangeMetadataInput = (key: string, index: number) => (
    e: SyntheticEvent
  ) => {
    const md = metadata.map((field: MetadataField, i: number) => {
      const target = e.target as HTMLInputElement;

      return i === index ? { ...field, [key]: target.value } : field;
    });
    setFieldsValue({ metadata: md });
  };

  getFieldDecorator('metadata', {
    initialValue: [{ id: uuid(), key: '', value: '' }],
  });

  const metadata =
    getFieldValue('metadata').length === 0
      ? [{ id: uuid(), key: '', value: '' }]
      : getFieldValue('metadata');

  const metadataFields = metadata.map((data: MetadataField, index: number) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithoutLabel)}
      label={index === 0 ? metadataLabel : ''}
      required={false}
      key={data.id}
    >
      <Input.Group compact={true} style={{ display: 'flex' }}>
        <Input
          className={`meta-key ${data.id}`}
          style={{ width: '45%', borderRight: 0 }}
          placeholder={metadataKey as string}
          value={data.key}
          onPressEnter={pressEnter}
          onChange={onChangeMetadataInput('key', index)}
        />

        <Input
          style={{
            width: '10%',
            borderLeft: 0,
            pointerEvents: 'none',
            backgroundColor: '#fff',
          }}
          value=":"
          disabled={true}
        />
        <Input
          className={`meta-value ${data.id}`}
          style={{ width: '45%', borderLeft: 0 }}
          value={data.value}
          placeholder={metadataValue as string}
          onPressEnter={pressEnter}
          onChange={onChangeMetadataInput('value', index)}
        />
        {metadata.length > 1 ? (
          <Icon
            type="minus-circle-o"
            style={{
              position: 'absolute',
              right: -32,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={() => onRemoveMetadata(data.id)}
          />
        ) : null}
      </Input.Group>
    </Form.Item>
  ));

  return (
    <Form
      layout="horizontal"
      onSubmit={submit}
      style={styles && styles.container}
    >
      <Form.Item label={nameField} {...formItemLayout}>
        {getFieldDecorator('name')(
          <Input
            className="name"
            name="name"
            maxLength={50}
            placeholder={nameField as string}
            onPressEnter={pressEnter}
          />
        )}
      </Form.Item>
      <Form.Item label={descriptionField} {...formItemLayout}>
        {getFieldDecorator('description')(
          <Input
            className="description"
            name="description"
            maxLength={500}
            placeholder={descriptionField as string}
            onPressEnter={pressEnter}
          />
        )}
      </Form.Item>
      {metadataFields}
      <Form.Item {...formItemLayoutWithoutLabel}>
        <Button
          htmlType="button"
          type="dashed"
          className="add-more-metadata"
          onClick={onAddMetadata}
          style={{ width: '100%', ...(styles && styles.addMoreMetadataButton) }}
        >
          <Icon type="plus" style={{ marginRight: 8 }} />
          {addMetadata}
        </Button>
      </Form.Item>

      {onSubmit && (
        <Form.Item {...formItemLayoutWithoutLabel}>
          <Button
            htmlType="submit"
            className="submit"
            type="primary"
            style={{ float: 'right' }}
          >
            {search}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

const SearchFormHOC = Form.create({
  name: 'asset-search',
  onValuesChange(props: SearchProps, _, allValues: AdvancedSearch = {}) {
    const { onChange } = props;
    if (onChange) {
      onChange(allValues);
    }
  },
  mapPropsToFields(props) {
    if (!props.value) {
      return {};
    }
    const { name, description, metadata } = props.value;

    return {
      name: Form.createFormField({ value: name }),
      description: Form.createFormField({ value: description }),
      metadata: Form.createFormField({
        value: metadata,
      }),
    };
  },
})(SearchForm);

SearchFormHOC.displayName = 'SearchForm';

export { SearchFormHOC as SearchForm };
