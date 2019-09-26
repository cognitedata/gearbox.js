import { Asset } from '@cognite/sdk';
import { Breadcrumb, Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { AssetBreadcrumbProps } from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';

const BreadcrumbWrapper = styled.div`
  .ant-breadcrumb-separator {
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.45);
  }
`;

interface AssetBreadcrumbState {
  assets: Asset[];
  isLoading: boolean;
}

class AssetBreadcrumb extends React.Component<
  AssetBreadcrumbProps,
  AssetBreadcrumbState
> {
  static contextType = ClientSDKContext;
  static defaultProps = {
    onBreadcrumbClick: () => undefined,
    theme: { ...defaultTheme },
  };

  state: AssetBreadcrumbState = {
    assets: [],
    isLoading: true,
  };

  async componentDidMount() {
    if (!this.context) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }

    const assets: Asset[] = [];
    let [currentAsset]: Asset[] = await this.context.assets.retrieve([
      { id: this.props.assetId },
    ]);

    assets.push(currentAsset);
    while (currentAsset.parentId) {
      [currentAsset] = await this.context.assets.retrieve([
        { id: currentAsset.parentId },
      ]);
      assets.push(currentAsset);
    }
    assets.reverse();

    this.setState({ assets, isLoading: false });
  }

  renderValue = (asset: Asset, index: number) => {
    const { renderItem, onBreadcrumbClick } = this.props;
    if (renderItem) {
      return renderItem(asset, index);
    }

    const ENTER_KEY_CODE = 13;
    return (
      <span
        tabIndex={0}
        role="button"
        style={{ cursor: 'pointer' }}
        onClick={() => onBreadcrumbClick!(asset, index)}
        onKeyDown={e =>
          e.keyCode === ENTER_KEY_CODE && onBreadcrumbClick!(asset, index)
        }
      >
        {asset.name || asset.id}
      </span>
    );
  };

  render() {
    const { assets, isLoading } = this.state;
    if (isLoading) {
      return <Icon type="loading" />;
    }
    return (
      <BreadcrumbWrapper>
        <Breadcrumb>
          {assets.map((asset, assetIndex) => (
            <Breadcrumb.Item key={asset.id || assetIndex}>
              {this.renderValue(asset, assetIndex)}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </BreadcrumbWrapper>
    );
  }
}

const Component = withDefaultTheme(AssetBreadcrumb);
Component.displayName = 'AssetBreadcrumb';

export { Component as AssetBreadcrumb };

// const AssetBreadcrumb = ({
//   assetId,
//   onBreadcrumbClick,
//   truncationDepth,
//   noLink,
// }) => {
//   const [path, setPath] = useState([]);
//   const [isLoading, setLoading] = useState(false);

//   const loadParent = async (id, pathTracker = []) => {
//     if (!id) {
//       return [];
//     }
//     try {
//       const asset = await apicache.getAsset(id);
//       if (!asset) {
//         return pathTracker;
//       }
//       const updatedPath = [asset, ...pathTracker];
//       if (asset.parentId) {
//         return loadParent(asset.parentId, updatedPath);
//       }
//       return updatedPath;
//     } catch (error) {
//       return pathTracker;
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     loadParent(assetId)
//       .then(setPath)
//       .then(() => setLoading(false));
//   }, [assetId]);

//   const handleBreadcrumbClick = (id, pathIndex) => {
//     metrics.track('click', { assetId: id, pathIndex });
//     onBreadcrumbClick(id);
//   };

//   const renderValue = (asset, index) => {
//     if (asset === TRUNCATE_ASSET) {
//       return HELLIP;
//     }
//     if (noLink) {
//       return (
//         <span
//           tabIndex={0}
//           role="button"
//           style={{ cursor: 'pointer' }}
//           onClick={() => handleBreadcrumbClick(asset.id, index)}
//           onKeyDown={e =>
//             e.keyCode === Keys.Codes.RETURN &&
//             handleBreadcrumbClick(asset.id, index)
//           }
//         >
//           {asset.name || asset.id}
//         </span>
//       );
//     }
//     return (
//       <Link
//         to={Paths.ASSETS(asset.id)}
//         onClick={() => handleBreadcrumbClick(asset.id, index)}
//       >
//         {asset.name || asset.id || HELLIP}
//       </Link>
//     );
//   };

//   if (isLoading) {
//     return <Icon type="loading" />;
//   }

//   if (!path || !path.length) {
//     return null;
//   }

//   let parsedPath = path;

//   // We don't want to truncate unnecessarily.
//   // Take our depths, add a padding of 2 for the last child and the single item being truncated.
//   if (truncationDepth && path.length > truncationDepth + 2) {
//     parsedPath = path.splice(truncationDepth, path.length - 3, TRUNCATE_ASSET);
//   }

//   return (
//     <BreadcrumbWrapper>
//       <Breadcrumb>
//         {parsedPath.map((asset, pathIndex) => (
//           <Breadcrumb.Item key={asset.id || pathIndex}>
//             {renderValue(asset, pathIndex)}
//           </Breadcrumb.Item>
//         ))}
//       </Breadcrumb>
//     </BreadcrumbWrapper>
//   );
// };

// AssetBreadcrumb.propTypes = propTypes;
// AssetBreadcrumb.defaultProps = defaultProps;

// export default AssetBreadcrumb;
