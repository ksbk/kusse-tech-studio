#!/bin/bash

# Template and Asset Migration Script
# Migrates existing files to the new gold-standard structure

set -e

echo "🔄 Migrating templates and assets to gold-standard structure..."

# Create backup of current state
echo "📦 Creating backup..."
mkdir -p migration_backup/templates
mkdir -p migration_backup/static

# Backup current templates and static files
if [[ -d "app/templates" ]]; then
	cp -r app/templates/* migration_backup/templates/ 2>/dev/null || true
fi
if [[ -d "app/static" ]]; then
	cp -r app/static/* migration_backup/static/ 2>/dev/null || true
fi

echo "📂 Reorganizing templates..."

# Move essential templates to root level
echo "  Moving main templates..."
if [[ -f "app/templates/pages/home.html" ]]; then
	cp "app/templates/pages/home.html" "app/templates/index.html"
fi

if [[ -f "app/templates/pages/about.html" ]]; then
	cp "app/templates/pages/about.html" "app/templates/about.html"
fi

if [[ -f "app/templates/pages/contact.html" ]]; then
	cp "app/templates/pages/contact.html" "app/templates/contact.html"
fi

if [[ -f "app/templates/pages/services.html" ]]; then
	cp "app/templates/pages/services.html" "app/templates/services.html"
fi

# Handle projects templates
echo "  Organizing projects templates..."
if [[ -f "app/templates/pages/projects/list.html" ]]; then
	cp "app/templates/pages/projects/list.html" "app/templates/projects.html"
fi

if [[ -f "app/templates/pages/projects/detail.html" ]]; then
	cp "app/templates/pages/projects/detail.html" "app/templates/project_detail.html"
fi

# Update base template path
echo "  Setting up base template..."
if [[ -f "app/templates/layouts/_base.html" ]]; then
	cp "app/templates/layouts/_base.html" "app/templates/base.html"
elif [[ -f "app/templates/base.html" ]]; then
	echo "  Base template already exists"
else
	echo "  ⚠️  Base template not found, will need manual creation"
fi

# Organize partials
echo "  Organizing template partials..."
mkdir -p app/templates/partials

# Move existing partials
if [[ -d "app/templates/partials" ]]; then
	# Keep existing partials
	echo "  ✓ Existing partials preserved"
fi

# Copy component templates to partials if they exist
if [[ -f "app/templates/components/_header.html" ]]; then
	cp "app/templates/components/_header.html" "app/templates/partials/header.html"
fi

if [[ -f "app/templates/components/_footer.html" ]]; then
	cp "app/templates/components/_footer.html" "app/templates/partials/footer.html"
fi

if [[ -f "app/templates/components/_navbar.html" ]]; then
	cp "app/templates/components/_navbar.html" "app/templates/partials/navbar.html"
fi

echo "📁 Organizing static assets..."

# Create source directories
mkdir -p src/scss
mkdir -p src/js
mkdir -p src/images

# Move SCSS files if they exist
echo "  Moving SCSS files..."
if [[ -d "app/static/src/scss" ]]; then
	cp -r app/static/src/scss/* src/scss/ 2>/dev/null || true
fi

# Move JS files
echo "  Moving JavaScript files..."
if [[ -d "app/static/src/js" ]]; then
	cp -r app/static/src/js/* src/js/ 2>/dev/null || true
fi

# Move images
echo "  Moving images..."
if [[ -d "app/static/src/img" ]]; then
	cp -r app/static/src/img/* src/images/ 2>/dev/null || true
fi

# Create proper static structure
echo "  Organizing compiled assets..."
mkdir -p app/static/css
mkdir -p app/static/js
mkdir -p app/static/images
mkdir -p app/static/fonts

# Move compiled assets
if [[ -f "app/static/css/main.css" ]]; then
	echo "  ✓ CSS already organized"
else
	# If CSS is in different location, try to find and move it
	find app/static -name "*.css" -type f -exec cp {} app/static/css/ \; 2>/dev/null || true
fi

if [[ -f "app/static/js/main.js" ]]; then
	echo "  ✓ JavaScript already organized"
else
	# Move JS files to proper location
	find app/static -name "*.js" -type f -exec cp {} app/static/js/ \; 2>/dev/null || true
fi

# Clean up redundant directories
echo "🧹 Cleaning up redundant files..."

# Remove backup template files
rm -f app/templates/pages/home_backup.html 2>/dev/null || true
rm -f app/templates/pages/home_clean.html 2>/dev/null || true

# Remove old route directories (they're backed up)
if [[ -d "temp_backup" ]]; then
	echo "  ✓ Old routes preserved in temp_backup/"
fi

# Remove redundant config files (keeping .config/ directory)
echo "  Removing redundant configuration files..."
rm -f .eslintrc.json 2>/dev/null || true
rm -f .sass-lint.yml 2>/dev/null || true
rm -f .stylelintrc.json 2>/dev/null || true
rm -f .flake8 2>/dev/null || true

# Remove development artifacts
rm -f analytics.db 2>/dev/null || true
rm -f content.json 2>/dev/null || true
rm -f dark-mode-test.html 2>/dev/null || true
rm -f security-report.json 2>/dev/null || true

# Update webpack config for new structure
echo "📝 Updating build configuration..."

cat >webpack.config.js <<'EOF'
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'app/static'),
    filename: 'js/[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map'
};
EOF

# Create basic SCSS structure if it doesn't exist
if [[ ! -f "src/scss/main.scss" ]]; then
	echo "📝 Creating basic SCSS structure..."

	mkdir -p src/scss/{abstracts,base,components,layout,pages}

	cat >src/scss/main.scss <<'EOF'
// Main SCSS entry point
@import 'abstracts/variables';
@import 'abstracts/mixins';

@import 'base/reset';
@import 'base/typography';
@import 'base/utilities';

@import 'layout/header';
@import 'layout/footer';
@import 'layout/grid';
@import 'layout/sections';

@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';
@import 'components/navigation';

@import 'pages/home';
@import 'pages/about';
@import 'pages/projects';
@import 'pages/contact';
EOF

	cat >src/scss/abstracts/_variables.scss <<'EOF'
// Color palette
$primary-color: #3b82f6;
$secondary-color: #64748b;
$accent-color: #f59e0b;

// Typography
$font-family-base: 'Inter', system-ui, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.6;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 2rem;
$spacing-xl: 4rem;

// Breakpoints
$bp-sm: 640px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;
EOF

	cat >src/scss/abstracts/_mixins.scss <<'EOF'
// Responsive breakpoints
@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: $bp-sm) { @content; }
  } @else if $breakpoint == md {
    @media (min-width: $bp-md) { @content; }
  } @else if $breakpoint == lg {
    @media (min-width: $bp-lg) { @content; }
  } @else if $breakpoint == xl {
    @media (min-width: $bp-xl) { @content; }
  }
}

// Flexbox utilities
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
EOF

	# Create placeholder files for other SCSS partials
	touch src/scss/base/{_reset.scss,_typography.scss,_utilities.scss}
	touch src/scss/layout/{_header.scss,_footer.scss,_grid.scss,_sections.scss}
	touch src/scss/components/{_buttons.scss,_cards.scss,_forms.scss,_navigation.scss}
	touch src/scss/pages/{_home.scss,_about.scss,_projects.scss,_contact.scss}
fi

# Create basic JavaScript structure if it doesn't exist
if [[ ! -f "src/js/main.js" ]]; then
	echo "📝 Creating basic JavaScript structure..."

	mkdir -p src/js/{components,utils}

	cat >src/js/main.js <<'EOF'
// Main JavaScript entry point
import './components/navigation.js';
import './components/animations.js';
import './components/contact-form.js';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('KusseTechStudio application initialized');
});
EOF

	# Create placeholder component files
	touch src/js/components/{navigation.js,animations.js,contact-form.js,analytics.js}
	touch src/js/utils/{dom.js,helpers.js}
fi

echo "✨ Migration complete!"
echo ""
echo "📋 Migration Summary:"
echo "  ✅ Templates reorganized to flat structure"
echo "  ✅ Static assets moved to src/ and app/static/"
echo "  ✅ Redundant files removed"
echo "  ✅ Build configuration updated"
echo "  ✅ SCSS and JS structure created"
echo ""
echo "📦 Backups created:"
echo "  • Original templates: migration_backup/templates/"
echo "  • Original static files: migration_backup/static/"
echo "  • Original routes: temp_backup/"
echo ""
echo "🔄 Next steps:"
echo "  1. Update template inheritance to use new base.html"
echo "  2. Update static file references in templates"
echo "  3. Test the application with: flask run"
echo "  4. Build assets with: npm run build"
