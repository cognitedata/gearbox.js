// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';

import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { SVGViewer } from '../SVGViewer';

configure({ adapter: new Adapter() });

const CANCEL_BUTTON_ATTR = '[data-test-id="close-svgviewer-btn"]';
const DOWNLOAD_BUTTON_ATTR = '[data-test-id="download-button-svgviewer"]';

class CogniteClient extends MockCogniteClient {
  files: any = {
    getDownloadUrls: async () => [{ downloadUrl: 'url', id: 123 }],
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

// gave up on searching of svg elements within enzyme output
// and used string parsing of html() that correctly contains svg
const hasStringExactlyOnce = (source: string, search: string) => {
  return (
    source.indexOf(search) > -1 &&
    source.indexOf(search) === source.lastIndexOf(search)
  );
};

describe('SVGViewer', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer documentId={0} />
      </ClientSDKProvider>
    );
    expect(wrapper.find(CANCEL_BUTTON_ATTR).length).toBe(0);
    expect(wrapper).toHaveLength(1);
  });

  it('Renders a cancel button', () => {
    const handleCancel = sinon.spy();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer documentId={0} handleCancel={handleCancel} />
      </ClientSDKProvider>
    );
    const closeButton = wrapper.find(CANCEL_BUTTON_ATTR);
    expect(closeButton).toBeTruthy();
    closeButton.first().simulate('click');

    expect(handleCancel.called).toBeTruthy();
  });

  it('should handle download button click', () => {
    window.open = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer documentId={0} downloadablePdf="path/to/file" />
      </ClientSDKProvider>
    );
    const downloadButton = wrapper.find(DOWNLOAD_BUTTON_ATTR);
    expect(downloadButton).toBeTruthy();
    downloadButton.first().simulate('click');

    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('Renders without exploding with a file', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer file="" />
      </ClientSDKProvider>
    );
    expect(wrapper.find(CANCEL_BUTTON_ATTR).length).toBe(0);
    expect(wrapper).toHaveLength(1);
  });

  it('updates maxZoom and minZoom props after creation', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer file="<svg/>" />
      </ClientSDKProvider>
    );
    const SVGViewerComponent = wrapper.find(SVGViewer).instance() as SVGViewer;
    wrapper.setProps(
      { children: <SVGViewer file="<svg/>" maxZoom={50} minZoom={10} /> },
      () => {
        wrapper.update();
        const { options } = SVGViewerComponent.pinchZoomInstance;
        expect(options.maxZoom).toEqual(50);
        expect(options.minZoom).toEqual(10);
      }
    );
  });

  it('adds .current-asset class by default', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer
          file={`<svg><g class='metadata-container'><metadata></metadata></g></svg>`}
          isCurrentAsset={() => true}
        />
      </ClientSDKProvider>
    );

    expect(hasStringExactlyOnce(wrapper.html(), 'current-asset')).toBe(true);
  });

  it('adds custom class for currentAsset when passed', () => {
    const customCurrentAssetClassName = 'customCurrentAssetClassName';

    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <SVGViewer
          file={`<svg><g class='metadata-container'><metadata></metadata></g></svg>`}
          isCurrentAsset={() => true}
          customClassNames={{
            currentAsset: customCurrentAssetClassName,
          }}
        />
      </ClientSDKProvider>
    );

    expect(hasStringExactlyOnce(wrapper.html(), 'current-asset')).toBe(false);
    expect(
      hasStringExactlyOnce(wrapper.html(), customCurrentAssetClassName)
    ).toBe(true);
  });

  describe('metadataClassesConditions tests', () => {
    const getConditionImplementation = (testId: number) => (meta: Element) => {
      const idEl = meta.querySelector('id');
      if (!idEl) {
        return false;
      }
      return Number(idEl.textContent) === testId;
    };

    it('executes all the passed conditions', () => {
      const testId0 = 123;
      const fn0 = jest
        .fn()
        .mockImplementation(getConditionImplementation(testId0));

      const testId1 = 456;
      const fn1 = jest
        .fn()
        .mockImplementation(getConditionImplementation(testId1));

      const classesAndConditions = [
        {
          className: 'class0',
          condition: fn0,
        },
        {
          className: 'class1',
          condition: fn1,
        },
      ];
      const wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <SVGViewer
            metadataClassesConditions={classesAndConditions}
            file={`<svg>
                  <g class='metadata-container'>
                    <metadata><id>${testId0}</id></metadata>
                  </g>
                  <g class='metadata-container'>
                    <metadata><id>${testId1}</id></metadata>
                  </g>
                </svg>
              `}
          />
        </ClientSDKProvider>
      );

      expect(fn0).toHaveBeenCalledTimes(2);
      expect(fn1).toHaveBeenCalledTimes(2);

      expect(
        hasStringExactlyOnce(wrapper.html(), classesAndConditions[0].className)
      ).toBe(true);
      expect(
        hasStringExactlyOnce(wrapper.html(), classesAndConditions[1].className)
      ).toBe(true);
    });

    it('passed conditions are not executed more than needed', () => {
      // e.g. when metadata-container already satisfies passed condition, that condition
      // should not be checked for other metadata items
      const getMockImplementation = (testId: number) => (meta: Element) => {
        const idEl = meta.querySelector('id');
        if (!idEl) {
          return false;
        }
        return Number(idEl.textContent) === testId;
      };

      const testId0 = 123;
      const fn0 = jest.fn().mockImplementation(getMockImplementation(testId0));

      const testId1 = 456;
      const fn1 = jest.fn().mockImplementation(getMockImplementation(testId1));

      const classesAndConditions = [
        {
          className: 'class0',
          condition: fn0,
        },
        {
          className: 'class1',
          condition: fn1,
        },
      ];

      mount(
        <ClientSDKProvider client={sdk}>
          <SVGViewer
            metadataClassesConditions={classesAndConditions}
            file={`<svg>
                  <g class='metadata-container'>
                    <metadata><id>${testId0}</id></metadata>
                    <metadata><id>${testId1}</id></metadata>
                    <metadata><id>Meaningless</id></metadata>
                  </g>
                  </svg>
              `}
          />
        </ClientSDKProvider>
      );

      expect(fn0).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(2);
    });
  });
});
