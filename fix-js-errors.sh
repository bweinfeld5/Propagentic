#!/bin/bash

echo "===== FIXING JAVASCRIPT LOADING ERRORS ====="

# Step 1: Fix firebase.json to ensure proper content types
echo "1. Creating a clean firebase.json with proper MIME types..."
cat > firebase.json << 'EOL'
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.js",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/javascript"
          },
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "**/*.css",
        "headers": [
          {
            "key": "Content-Type",
            "value": "text/css"
          },
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
EOL

# Step 2: Update all React component imports to remove .js extensions
echo "2. Fixing React component imports..."
find src -name "*.js" -exec sed -i '' -e 's/from \(.*\)\.js/from \1/g' {} \;

# Step 3: Ensure our HTML files have proper error handling
echo "3. Adding diagnostic page to check JS loading..."
mkdir -p public
cat > public/debug.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Loading Debug</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .success { color: green; }
    .error { color: red; }
    pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>JavaScript Loading Diagnostics</h1>
  <p>This page tests if JavaScript is loading correctly.</p>
  
  <h2>Basic JavaScript</h2>
  <div id="basic-test">Testing...</div>
  <script>
    document.getElementById('basic-test').innerHTML = '<span class="success">JavaScript is working!</span>';
  </script>
  
  <h2>React Bundle</h2>
  <div id="bundle-test">Testing bundle loading...</div>
  <script>
    // Get the actual bundle name from the build directory
    fetch('/index.html')
      .then(response => response.text())
      .then(html => {
        const match = html.match(/\/static\/js\/main\.([a-z0-9]+)\.js/);
        if (match) {
          const bundlePath = match[0];
          document.getElementById('bundle-test').innerHTML = 
            `Found bundle: ${bundlePath} - <span class="success">Attempting to load...</span>`;
          
          const script = document.createElement('script');
          script.src = bundlePath;
          script.onerror = () => {
            document.getElementById('bundle-test').innerHTML = 
              `<span class="error">Failed to load ${bundlePath}</span>`;
            
            // Try to fetch the file directly to see what's being returned
            fetch(bundlePath)
              .then(response => response.text())
              .then(text => {
                const preview = text.slice(0, 200);
                const bundleInfo = document.createElement('div');
                bundleInfo.innerHTML = `
                  <p>Bundle content preview:</p>
                  <pre>${preview.replace(/</g, '&lt;')}...</pre>
                `;
                if (preview.includes('<!DOCTYPE html>') || preview.includes('<html')) {
                  bundleInfo.innerHTML += `
                    <p class="error">The server is returning HTML instead of JavaScript!</p>
                    <p>This is likely causing the "Unexpected token '<'" error.</p>
                  `;
                }
                document.getElementById('bundle-test').appendChild(bundleInfo);
              })
              .catch(error => {
                document.getElementById('bundle-test').innerHTML += 
                  `<p class="error">Error fetching bundle: ${error.message}</p>`;
              });
          };
          
          script.onload = () => {
            document.getElementById('bundle-test').innerHTML = 
              `<span class="success">Bundle ${bundlePath} loaded successfully!</span>`;
          };
          
          document.head.appendChild(script);
        } else {
          document.getElementById('bundle-test').innerHTML = 
            `<span class="error">Could not find bundle path in index.html</span>`;
        }
      })
      .catch(error => {
        document.getElementById('bundle-test').innerHTML = 
          `<span class="error">Error: ${error.message}</span>`;
      });
  </script>
  
  <h2>Browser Info</h2>
  <pre id="browser-info"></pre>
  <script>
    document.getElementById('browser-info').textContent = `
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
    `;
  </script>
</body>
</html>
EOL

# Step 4: Rebuild and deploy
echo "4. Rebuilding the application..."
npm run build || { echo "Build failed!"; exit 1; }

echo "5. Deploying to Firebase..."
npx firebase-tools deploy --only hosting || { echo "Deploy failed!"; exit 1; }

echo "===== FIXES COMPLETE ====="
echo "Your site is now deployed at https://propagentic.web.app"
echo "To diagnose any remaining issues, visit https://propagentic.web.app/debug.html" 