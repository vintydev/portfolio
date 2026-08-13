using Microsoft.Extensions.Hosting;

// Entry point for the Azure Functions application
var host = new HostBuilder().ConfigureFunctionsWorkerDefaults().Build();

// Run the host to start processing incoming requests
host.Run();