
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpSentEvent,
	HttpHeaderResponse,
	HttpProgressEvent,
	HttpResponse,
	HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

/**
 * A request options adapting interceptor based on the new HttpClientModule from Angular 4.3.4 and above
 * @author Zhendong Tan
 */
@Injectable()
export class RequestOptionsAdapterInterceptor implements HttpInterceptor {
	constructor(private locn: Location) {}
	constructor(private locn: Location) { }

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
		let adaptedUrl = this.getAdaptedUrl(req.url || '');
		let adaptedReq = req.clone({
			withCredentials: true,
			url: adaptedUrl,
			setHeaders: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		});
		if (req.url.includes('v1/token')) {
			adaptedReq = req.clone({
				withCredentials: false,
				url: adaptedUrl,
				setHeaders: {
				}
			});
		}
		return next.handle(adaptedReq);
	}

	private getAdaptedUrl(url: string) {
		let appBasePath = (this.locn.prepareExternalUrl('/') || '').replace(/\/+$/, '');
		let contextPath = ($('context').attr('path') || '').replace(/\/+$/, '');

		if (url.startsWith('/')) {
			if (contextPath) {
				return contextPath + url;
			}
		} else if (!/^([a-z][a-z0-9+\-.]*):/.test(url.trim())) {
			if (appBasePath) {
				return appBasePath + '/' + url;
			}
		}
	}
}

}
