# Modify for your environment.
# ACR_NAME: The name of your Azure Container Registry
# SERVICE_PRINCIPAL_NAME: Must be unique within your AD tenant
$ACR_NAME = "bortubecontainers"
$SERVICE_PRINCIPAL_NAME = "Bortube principal"

# Obtain the full registry ID
$ACR_REGISTRY_ID = az acr show --name $ACR_NAME --query "id" --output tsv

# Create the service principal with rights scoped to the registry.
# Default permissions are for docker pull access. Modify the '--role'
# argument value as desired:
# acrpull:     pull only
# acrpush:     push and pull
# owner:       push, pull, and assign roles
$PASSWORD = az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --scopes $ACR_REGISTRY_ID --role acrpull --query "password" --output tsv
$USER_NAME = az ad sp list --display-name $SERVICE_PRINCIPAL_NAME --query "[].appId" --output tsv

# Output the service principal's credentials; use these in your services and
# applications to authenticate to the container registry.
Write-Host "Service principal ID: $USER_NAME"
Write-Host "Service principal password: $PASSWORD"