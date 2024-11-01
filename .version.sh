# version.sh

VERSION=$(grep -oP '(?<="version": ")[^"]*' ./api/package.json)
echo $VERSION