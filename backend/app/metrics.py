from prometheus_client import Counter, Histogram, Gauge
import time

# Define metrics
REQUEST_COUNT = Counter(
    'veritas_request_count', 
    'App Request Count', 
    ['app_name', 'method', 'endpoint', 'http_status']
)

REQUEST_LATENCY = Histogram(
    'veritas_request_latency_seconds', 
    'Request latency in seconds', 
    ['app_name', 'endpoint']
)

ACTIVE_REQUESTS = Gauge(
    'veritas_active_requests', 
    'Number of active requests', 
    ['app_name']
)

# Define a middleware to track request metrics
class PrometheusMiddleware:
    def __init__(self, app_name):
        self.app_name = app_name
    
    async def __call__(self, request, call_next):
        ACTIVE_REQUESTS.labels(self.app_name).inc()
        start_time = time.time()
        
        try:
            response = await call_next(request)
            REQUEST_COUNT.labels(
                self.app_name,
                request.method,
                request.url.path,
                response.status_code
            ).inc()
            
            return response
        except Exception as e:
            REQUEST_COUNT.labels(
                self.app_name,
                request.method,
                request.url.path,
                500
            ).inc()
            raise e
        finally:
            latency = time.time() - start_time
            REQUEST_LATENCY.labels(
                self.app_name,
                request.url.path
            ).observe(latency)
            ACTIVE_REQUESTS.labels(self.app_name).dec()
