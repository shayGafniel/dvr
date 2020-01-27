import { isArray } from 'lodash-es';
import {
  Breadcrumb,
  BreadcrumbBeforeItem,
  BreadcrumbMap,
  DataOfPath,
} from '../../common/models/routing.model';

export class BreadcrumbsUtil {
  public static generateBreadcrumbs(
    dataOfPaths: DataOfPath[],
    breadcrumbMap: BreadcrumbMap,
  ): Breadcrumb[] {
    const breadcrumbsBefore = BreadcrumbsUtil.getBreadcrumbsBefore(dataOfPaths);
    const breadcrumbs = BreadcrumbsUtil.getBreadcrumbs(dataOfPaths);

    return BreadcrumbsUtil.applyBreadcrumbMap(
      [...breadcrumbsBefore, ...breadcrumbs],
      breadcrumbMap,
    );
  }

  private static getBreadcrumbsBefore(dataOfPaths: DataOfPath[]): Breadcrumb[] {
    return dataOfPaths.reduce((breadcrumbs: Breadcrumb[], dataOfPath) => {
      return isArray(dataOfPath.breadcrumbBeforeItems)
        ? BreadcrumbsUtil.getBreadcrumbsFromBeforeItems(
            breadcrumbs,
            dataOfPath.breadcrumbBeforeItems,
          )
        : breadcrumbs;
    }, []);
  }

  private static getBreadcrumbsFromBeforeItems(
    breadcrumbs: Breadcrumb[],
    breadcrumbBeforeItems: BreadcrumbBeforeItem[],
  ): Breadcrumb[] {
    const breadcrumbsBefore = breadcrumbBeforeItems.reduce(
      (breadcrumbsAcc, { link, title }) => {
        const isAddedBreadcrumb = breadcrumbs.find(
          addedBreadcrumb => addedBreadcrumb.title === title,
        );

        if (!isAddedBreadcrumb) {
          breadcrumbsAcc.push({ link, title });
        }

        return breadcrumbsAcc;
      },
      [] as Breadcrumb[],
    );

    return [...breadcrumbs, ...breadcrumbsBefore] as Breadcrumb[];
  }

  private static getBreadcrumbs(dataOfPaths: DataOfPath[]): Breadcrumb[] {
    return dataOfPaths.reduce((breadcrumbs: Breadcrumb[], { breadcrumb, breadcrumbLink }) => {
      const isAddedBreadcrumb = breadcrumbs.find(
        addedBreadcrumb => addedBreadcrumb.title === breadcrumb,
      );

      if (breadcrumb && !isAddedBreadcrumb) {
        breadcrumbs.push({ link: breadcrumbLink, title: breadcrumb });
      }

      return breadcrumbs;
    }, []);
  }

  private static applyBreadcrumbMap(
    breadcrumbs: Breadcrumb[],
    breadcrumbMap: BreadcrumbMap,
  ): Breadcrumb[] {
    return breadcrumbs.map(breadcrumb => ({
      ...breadcrumb,
      title: breadcrumbMap[breadcrumb.title] || breadcrumb.title,
    }));
  }
}
