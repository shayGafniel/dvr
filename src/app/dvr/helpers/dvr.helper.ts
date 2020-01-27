import { HttpParams } from '@angular/common/http';
import { isArray, isEqual, isObject, isString, uniq, without } from 'lodash-es';
import * as moment from 'moment';
import { unbox } from 'ngrx-forms';

import { Country, SimplifiedCountry } from '../../common/services/configuration/configuration.model';
import { hash } from '../../common/utils/hash.util';
import { CasesFilter, entityAllValueId } from '../models/case.model';
import { Draft, RangeValue, Refund } from '../models/dvr.model';
import { GroupedRefundNodes, RefundFlatNode, RefundNode } from '../models/refund.model';
import { PotentialHelper } from './potential.helper';
import { CommonUtil } from '../../shared/utils/common.util';
import { MainFiltersUtil } from '../../shared/utils/main-filters.util';
import { CasesFilterFormValue } from '../store/cases-filter-form/cases-filter-form.state';
import { DvrRefundComments } from '../store/comment-form/comment-form.model';
import { CountryAggregate, RefundAggregate } from '../store/dvr/dvr.state';

export class DvrHelper {
  public static addIdToRefunds(refunds: Refund[], url: string): Refund[] {
    return DvrHelper.setIdToRefunds(refunds, (processingRefunds: Refund[], refund: Refund) =>
      DvrHelper.generateRefundId(processingRefunds, refund, url),
    );
  }

  private static generateRefundId(
    processingRefunds: Refund[],
    refund: Refund,
    url: string,
  ): string {
    const foundIndex =
      processingRefunds.findIndex(processingRefund => processingRefund.name === refund.name) || 0;

    return hash(`${refund.name}.${refund.country}.${url}.${foundIndex}`);
  }

  public static buildNodesTree(refunds: Refund[]): RefundNode[] {
    return refunds.map(refund => {
      const node = new RefundNode();

      node.item = refund.name;
      node.refund = refund;

      if (Array.isArray(refund.children) && refund.children.length) {
        node.children = DvrHelper.buildNodesTree(refund.children);
      }

      return node;
    });
  }

  public static convertCasesFilterFormValue(formValue: CasesFilterFormValue): CasesFilter {
    return CommonUtil.clearObject({
      id: formValue.id,
      start: DvrHelper.getFormattedDate(MainFiltersUtil.getFromDate(formValue.timeFrame)),
      end: DvrHelper.getFormattedDate(moment().add(1, 'M')),
      entityIds: without(unbox(formValue.entities), entityAllValueId),
      status: formValue.status,
    });
  }

  public static countriesToSimplifiedCountries(countries: Country[]): SimplifiedCountry[] {
    return countries.map(country => ({ code: country.code, name: country.name }));
  }

  public static filterSupportedCountries(countries: Country[]): Country[] {
    return countries.filter(country => country.supported === 'supported');
  }

  public static findRefundParent(refunds: Refund[], target: Refund): Refund {
    const refundParent = DvrHelper.findRefundParentSafely(refunds, target);

    if (!refundParent) {
      throw new Error(`Parent was not found for refund with id '${target.id}'`);
    }

    return refundParent;
  }

  private static findRefundParentSafely(refunds: Refund[], target: Refund): Refund {
    return refunds.find(refund =>
      Boolean((refund.children || []).find(child => child.id === target.id)),
    );
  }

  public static generateFlatNodesFromRefunds(refunds: Refund[]): RefundFlatNode[] {
    const flattenRefunds: Refund[] = DvrHelper.getFlattenRefunds(refunds);
    const nodes: RefundNode[] = DvrHelper.buildNodesTree(flattenRefunds);

    let lastParent = null;
    return nodes.map(node => {
      let currentParent = null;
      if (DvrHelper.isTopLevelRefund(refunds, node.refund)) {
        lastParent = node.item;
      } else {
        currentParent =
          (Array.isArray(node.children) && node.children.length) > 0 ? lastParent : null;
      }

      return PotentialHelper.refundNodeToFlatNode(
        node,
        DvrHelper.isTopLevelRefund(refunds, node.refund) ? 0 : 1,
        currentParent,
      );
    });
  }

  private static getFlattenRefunds(refunds: Refund[]): Refund[] {
    return refunds.reduce(
      (flattenRefunds, refund) => [...flattenRefunds, refund, ...(refund.children || [])],
      [],
    );
  }

  private static isTopLevelRefund(refunds: Refund[], target: Refund): boolean {
    return !Boolean(DvrHelper.findRefundParentSafely(refunds, target));
  }

  public static generateGroupedRefundNodes(countryAggregate: CountryAggregate): GroupedRefundNodes {
    return Object.entries(countryAggregate).reduce(
      (groupedRefunds: GroupedRefundNodes, [country, refundAggregate]) => {
        groupedRefunds[country] = this.flatNodesToNodes(
          refundAggregate.selectedFlatNodes,
          refundAggregate.refunds,
        );

        return groupedRefunds;
      },
      {},
    );
  }

  private static flatNodesToNodes(
    selectedFlatNodes: RefundFlatNode[],
    allRefunds: Refund[],
  ): RefundNode[] {
    const parentRefunds: Refund[] = Array.from(
      selectedFlatNodes
        .filter(node => node.level === 1)
        .reduce(
          (parents, node) => parents.add(DvrHelper.findRefundParent(allRefunds, node.refund)),
          new Set(),
        ),
    ) as Refund[];

    const toplevelRefunds: Refund[] = selectedFlatNodes
      .filter(node => node.level === 0)
      .map(node => node.refund)
      .filter(toplevelRefund =>
        parentRefunds.every(parentRefund => parentRefund.id !== toplevelRefund.id),
      );

    return [...parentRefunds, ...toplevelRefunds].map(refund => {
      const children: RefundNode[] =
        isArray(refund.children) && refund.children.length
          ? refund.children
              .filter(child =>
                selectedFlatNodes.some(nodeChild => nodeChild.refund.id === child.id),
              )
              .map(child => ({
                children: null,
                item: child.name,
                refund: child,
                parent: refund.name,
              }))
          : null;

      return { parent: null, children, item: refund.name, refund } as RefundNode;
    });
  }

  public static generateRefundCommentsFromRefunds(refunds: Refund[] = []): DvrRefundComments {
    return refunds.reduce((refundComments, refund) => {
      const childrenComments = DvrHelper.generateRefundCommentsFromRefunds(refund.children);

      return { ...refundComments, [refund.id]: '', ...childrenComments };
    }, {});
  }

  public static getEmptyDateRange(): RangeValue {
    return {
      end: '',
      start: '',
    };
  }

  public static getFormattedDate(date: moment.MomentInput): string {
    return (date || '') && moment(date).format('YYYY-MM');
  }

  public static getPreparedParams(params: { [key: string]: string | string[] }): HttpParams {
    return Object.entries(params).reduce(
      (httpParams: HttpParams, [key, value]: [string, string | string[]]) => {
        return Array.isArray(value)
          ? DvrHelper.getParamsFromArray(httpParams, key, value)
          : isString(value) && value.length > 0
            ? httpParams.set(key, value)
            : httpParams;
      },
      new HttpParams(),
    );
  }

  private static getParamsFromArray(
    httpParams: HttpParams,
    key: string,
    array: string[],
  ): HttpParams {
    return uniq(array).reduce(
      (httpParamsInner: HttpParams, valueInner: string) => httpParamsInner.append(key, valueInner),
      httpParams,
    );
  }

  public static isFilledDraft(draft: Draft): boolean {
    return (
      isObject(draft) &&
      Array.isArray(draft.refunds) &&
      draft.refunds.length > 0 &&
      Boolean(draft.email.length)
    );
  }

  /**
   * Expecting date format as in RefundsRequest model
   */
  public static isValidDateFormat(date: string): boolean {
    return /20\d\d-(0\d|1[0-2])$/.test(date);
  }

  public static setIdToRefunds(
    refunds: Refund[],
    idFn: (processingRefunds: Refund[], refund: Refund) => string,
  ): Refund[] {
    return refunds.reduce((processingRefunds, refund) => {
      const id = idFn(processingRefunds, refund);
      const namedRefund = { ...refund, id };

      if (Array.isArray(refund.children) && refund.children.length) {
        namedRefund.children = DvrHelper.setIdToRefunds(refund.children, idFn);
      }

      return [...processingRefunds, namedRefund];
    }, []);
  }

  public static setOrUpdateRefundNodes(
    refundAggregate: RefundAggregate,
    refunds: Refund[],
  ): RefundNode[] {
    return refundAggregate && refundAggregate.refundNodes
      ? DvrHelper.updateRefundNodes(refundAggregate.refundNodes, refunds)
      : DvrHelper.buildNodesTree(refunds);
  }

  public static updateRefundNodes(refundNodes: RefundNode[], refunds: Refund[]): RefundNode[] {
    const newRefundNodes = DvrHelper.buildNodesTree(refunds);

    return newRefundNodes.map(newRefundNode => {
      const foundRefundNode = refundNodes.find(
        refundNode => newRefundNode.refund.id === refundNode.refund.id,
      );

      return isEqual(newRefundNode, foundRefundNode) ? foundRefundNode : newRefundNode;
    });
  }

  public static validateRange(range: RangeValue): void {
    if (!range.end || !range.start) {
      return;
    }

    if (!DvrHelper.isValidDateFormat(range.end) || !this.isValidDateFormat(range.start)) {
      throw new TypeError(
        `Expected date format "YYYY-MM" but received end "${range.end}" and start "${range.start}"`,
      );
    }
  }

  public static verifyFlatNodes(
    refundAggregate: RefundAggregate,
    refundNodes: RefundNode[],
  ): RefundFlatNode[] {
    return refundAggregate && refundAggregate.selectedFlatNodes
      ? DvrHelper.updateFlatNodes(refundAggregate.selectedFlatNodes, refundNodes)
      : [];
  }

  private static updateFlatNodes(
    verifiedFlatNodes: RefundFlatNode[],
    refundNodes: RefundNode[],
  ): RefundFlatNode[] {
    return verifiedFlatNodes.reduce((flatNodes, flatNode) => {
      const foundNode = refundNodes.find(node => {
        const childContains = Boolean(
          (node.children || []).find(child => isEqual(child.refund, flatNode.refund)),
        );

        return childContains || isEqual(node.refund, flatNode.refund);
      });

      return foundNode ? [...flatNodes, flatNode] : flatNodes;
    }, []);
  }
}
