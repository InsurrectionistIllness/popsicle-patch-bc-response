# popsicle-patch-bc-response

Business Catalyst doesn't set useful status codes on some of its responses. 
This attempts to correct that by examining the response body and looking for
certain words, such as "unauthorised" and "please log in".
 
Designed to fit in with [popsicle](https://github.com/blakeembrey/popsicle) 
and [popsicle-status.](https://github.com/blakeembrey/popsicle-status) 

## Example

    const updateRequest = popsicle(requestOptions)
                .after(patcher.patchAuthErrorResponses)
                .use(status());
                
