from datetime import datetime
from flask import Blueprint, render_template, request, abort
from markupsafe import Markup
import markdown
import re
from collections import defaultdict

bp = Blueprint("blog", __name__, url_prefix="/blog")

# Sample blog posts data (in production, this would come from a database)
BLOG_POSTS = [
    {
        "id": 1,
        "title": "5 Python Automation Scripts Every Icelandic Business Should Have",
        "slug": "python-automation-scripts-icelandic-business",
        "excerpt": "Discover the essential Python automation scripts that can save Icelandic businesses hours of manual work every week.",
        "content": """# 5 Python Automation Scripts Every Icelandic Business Should Have

Iceland's tech-savvy business landscape is perfect for automation. Here are 5 Python scripts that can transform your operations:

## 1. Automated Data Backup to Cloud Storage

```python
import boto3
import schedule
import time
from datetime import datetime

def backup_to_s3():
    s3 = boto3.client('s3')
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Upload your critical files
    s3.upload_file(
        'local_file.csv', 
        'iceland-business-backups', 
        f'backups/{timestamp}_data.csv'
    )
    print(f"Backup completed at {timestamp}")

# Schedule daily backups
schedule.every().day.at("02:00").do(backup_to_s3)

while True:
    schedule.run_pending()
    time.sleep(60)
```

This script ensures your business data is safely backed up to AWS S3 every night.

## 2. Invoice Processing Automation

```python
import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def process_invoices(excel_file):
    df = pd.read_excel(excel_file)
    
    for _, invoice in df.iterrows():
        if invoice['status'] == 'pending':
            send_invoice_email(
                invoice['client_email'],
                invoice['amount'],
                invoice['due_date']
            )
            
def send_invoice_email(email, amount, due_date):
    # Email configuration for Iceland businesses
    smtp_server = "smtp.gmail.com"
    port = 587
    
    message = f'''
    Dear Client,
    
    Your invoice for {amount} ISK is due on {due_date}.
    
    Best regards,
    Your Iceland Business Team
    '''
    
    # Send email logic here
    print(f"Invoice sent to {email}")

# Process invoices daily
process_invoices('invoices.xlsx')
```

## 3. Web Scraping for Market Research

Perfect for monitoring Icelandic market trends and competitor pricing.

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime

def scrape_iceland_market_data():
    urls = [
        'https://example-icelandic-site.is/prices',
        'https://competitor-site.is/products'
    ]
    
    market_data = []
    
    for url in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract pricing data
        prices = soup.find_all('span', class_='price')
        for price in prices:
            market_data.append({
                'date': datetime.now(),
                'source': url,
                'price': price.text.strip(),
                'currency': 'ISK'
            })
    
    # Save to Excel for analysis
    df = pd.DataFrame(market_data)
    df.to_excel(f'market_data_{datetime.now().strftime("%Y%m%d")}.xlsx')
    
    return market_data
```

## 4. Automated Social Media Posting

Keep your Iceland business visible on social media:

```python
import tweepy
import facebook
import schedule
from datetime import datetime

class SocialMediaManager:
    def __init__(self):
        # Initialize social media APIs
        self.twitter_api = self.setup_twitter()
        self.facebook_api = self.setup_facebook()
    
    def post_daily_tip(self):
        tips = [
            "🇮🇸 Did you know Python can automate your business processes? #IcelandTech",
            "Automate your data analysis with Python! Perfect for Icelandic businesses. #DataScience",
            "Save time with Python automation scripts! Contact us for custom solutions. #PythonAutomation"
        ]
        
        tip = tips[datetime.now().day % len(tips)]
        
        # Post to Twitter
        self.twitter_api.update_status(tip)
        
        # Post to Facebook
        self.facebook_api.put_object("me", "feed", message=tip)
        
        print(f"Posted: {tip}")

# Schedule posts
social_manager = SocialMediaManager()
schedule.every().day.at("09:00").do(social_manager.post_daily_tip)
```

## 5. Customer Database Cleanup

Keep your customer data clean and up-to-date:

```python
import pandas as pd
import re
from fuzzywuzzy import fuzz

def clean_customer_database(file_path):
    df = pd.read_excel(file_path)
    
    # Clean phone numbers for Iceland format
    def clean_icelandic_phone(phone):
        if pd.isna(phone):
            return phone
        
        # Remove all non-digits
        digits = re.sub(r'[^0-9]', '', str(phone))
        
        # Format as Icelandic number
        if len(digits) == 7:
            return f"581-{digits}"
        elif len(digits) == 10 and digits.startswith('354'):
            return f"+354-{digits[3:6]}-{digits[6:]}"
        
        return phone
    
    # Clean email addresses
    def clean_email(email):
        if pd.isna(email):
            return email
        
        email = str(email).lower().strip()
        if '@' not in email:
            return None
        
        return email
    
    # Apply cleaning
    df['phone_clean'] = df['phone'].apply(clean_icelandic_phone)
    df['email_clean'] = df['email'].apply(clean_email)
    
    # Remove duplicates
    df_clean = df.drop_duplicates(subset=['email_clean'])
    
    # Save cleaned data
    df_clean.to_excel('customers_cleaned.xlsx', index=False)
    
    print(f"Cleaned {len(df)} records down to {len(df_clean)} unique customers")
    
    return df_clean
```

## Getting Started

These scripts are perfect starting points for Icelandic businesses looking to:

- **Save Time**: Automate repetitive tasks
- **Reduce Errors**: Eliminate manual data entry mistakes  
- **Scale Operations**: Handle more work with the same team
- **Stay Competitive**: Use data-driven insights

## Need Custom Automation?

Every Icelandic business has unique needs. Contact us to discuss custom Python automation solutions tailored to your specific requirements.

**Ready to automate your business?** [Get in touch](/contact) for a free consultation!
""",
        "author": "KusseTechStudio Team",
        "published_date": datetime(2024, 12, 15),
        "updated_date": datetime(2024, 12, 15),
        "category": "automation",
        "tags": ["python", "automation", "iceland", "business", "scripts"],
        "featured": True,
        "reading_time": 8,
        "image": "python-automation-iceland.jpg",
        "meta_description": "5 essential Python automation scripts every Icelandic business should implement to save time, reduce errors, and scale operations effectively.",
        "status": "published"
    },
    {
        "id": 2,
        "title": "Web Scraping Best Practices for Iceland Market Research",
        "slug": "web-scraping-iceland-market-research",
        "excerpt": "Learn ethical web scraping techniques to gather market intelligence for your Icelandic business using Python and BeautifulSoup.",
        "content": """# Web Scraping Best Practices for Iceland Market Research

Market research is crucial for Icelandic businesses, but manual data collection is time-consuming. Here's how to automate it ethically with Python.

## Why Web Scraping for Market Research?

Iceland's digital-first business environment means most market data is available online. Web scraping helps you:

- Track competitor pricing in real-time
- Monitor industry trends
- Analyze customer sentiment
- Identify market opportunities

## Essential Tools

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from urllib.robotparser import RobotFileParser
```

## Ethical Scraping Guidelines

### 1. Always Check robots.txt

```python
def can_scrape(url):
    rp = RobotFileParser()
    rp.set_url(f"{url}/robots.txt")
    rp.read()
    return rp.can_fetch('*', url)

# Example usage
if can_scrape('https://example-site.is'):
    print("Safe to scrape!")
else:
    print("Scraping not allowed")
```

### 2. Implement Rate Limiting

```python
def polite_scraper(urls, delay_range=(1, 3)):
    results = []
    
    for url in urls:
        # Random delay between requests
        delay = random.uniform(*delay_range)
        time.sleep(delay)
        
        try:
            response = requests.get(url, headers={
                'User-Agent': 'Mozilla/5.0 (compatible; MarketResearchBot/1.0)'
            })
            
            if response.status_code == 200:
                results.append(response)
            else:
                print(f"Failed to scrape {url}: {response.status_code}")
                
        except Exception as e:
            print(f"Error scraping {url}: {e}")
    
    return results
```

## Practical Examples

### Scraping Icelandic Real Estate Prices

```python
def scrape_iceland_property_prices():
    base_url = "https://example-realestate.is"
    
    # Check if scraping is allowed
    if not can_scrape(base_url):
        print("Scraping not permitted")
        return
    
    properties = []
    
    for page in range(1, 6):  # First 5 pages
        url = f"{base_url}/search?page={page}"
        
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        for property_card in soup.find_all('div', class_='property-card'):
            property_data = {
                'address': property_card.find('h3').text.strip(),
                'price': property_card.find('span', class_='price').text.strip(),
                'size': property_card.find('span', class_='size').text.strip(),
                'scraped_date': datetime.now()
            }
            properties.append(property_data)
        
        # Be polite - wait between pages
        time.sleep(random.uniform(2, 4))
    
    # Save to Excel
    df = pd.DataFrame(properties)
    df.to_excel('iceland_properties.xlsx', index=False)
    
    return properties
```

### Monitoring Competitor Pricing

```python
class CompetitorMonitor:
    def __init__(self, competitors):
        self.competitors = competitors
        self.price_history = []
    
    def scrape_competitor_prices(self):
        for competitor in self.competitors:
            try:
                response = requests.get(competitor['url'])
                soup = BeautifulSoup(response.content, 'html.parser')
                
                price_element = soup.find('span', class_=competitor['price_class'])
                if price_element:
                    price = self.clean_price(price_element.text)
                    
                    self.price_history.append({
                        'competitor': competitor['name'],
                        'product': competitor['product'],
                        'price': price,
                        'currency': 'ISK',
                        'date': datetime.now()
                    })
                
                # Respectful delay
                time.sleep(random.uniform(3, 6))
                
            except Exception as e:
                print(f"Error monitoring {competitor['name']}: {e}")
    
    def clean_price(self, price_text):
        # Extract numeric price from text
        import re
        numbers = re.findall(r'[\d,]+', price_text)
        if numbers:
            return int(numbers[0].replace(',', ''))
        return None
    
    def save_data(self):
        df = pd.DataFrame(self.price_history)
        df.to_excel(f'competitor_prices_{datetime.now().strftime("%Y%m%d")}.xlsx')

# Usage
competitors = [
    {
        'name': 'Competitor A',
        'url': 'https://competitor-a.is/product',
        'price_class': 'product-price',
        'product': 'Software License'
    }
]

monitor = CompetitorMonitor(competitors)
monitor.scrape_competitor_prices()
monitor.save_data()
```

## Data Analysis and Insights

### Price Trend Analysis

```python
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_price_trends(data_file):
    df = pd.read_excel(data_file)
    df['date'] = pd.to_datetime(df['date'])
    
    # Plot price trends
    plt.figure(figsize=(12, 6))
    
    for competitor in df['competitor'].unique():
        competitor_data = df[df['competitor'] == competitor]
        plt.plot(competitor_data['date'], competitor_data['price'], 
                label=competitor, marker='o')
    
    plt.title('Competitor Price Trends - Iceland Market')
    plt.xlabel('Date')
    plt.ylabel('Price (ISK)')
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('price_trends.png')
    plt.show()
    
    # Calculate price changes
    df_sorted = df.sort_values(['competitor', 'date'])
    df_sorted['price_change'] = df_sorted.groupby('competitor')['price'].pct_change()
    
    return df_sorted
```

## Advanced Techniques

### Handling JavaScript-Heavy Sites

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def scrape_dynamic_content(url):
    # Setup headless Chrome
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        driver.get(url)
        time.sleep(3)  # Wait for JavaScript to load
        
        # Now scrape the rendered content
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Extract data as needed
        data = []
        for item in soup.find_all('div', class_='dynamic-content'):
            data.append(item.text.strip())
        
        return data
        
    finally:
        driver.quit()
```

## Legal and Ethical Considerations

### For Iceland Businesses

1. **Respect GDPR**: Iceland follows EU data protection laws
2. **Check Terms of Service**: Always review website terms
3. **Rate Limiting**: Don't overload servers
4. **Attribution**: Credit data sources when appropriate
5. **Personal Data**: Avoid scraping personal information

### Best Practices Checklist

- ✅ Check robots.txt before scraping
- ✅ Implement delays between requests
- ✅ Use appropriate User-Agent headers
- ✅ Handle errors gracefully
- ✅ Store data securely
- ✅ Respect copyright and terms of service

## Getting Started

Start with these steps:

1. **Identify Data Sources**: List websites with relevant market data
2. **Check Permissions**: Review robots.txt and terms of service
3. **Start Small**: Begin with a few pages and low frequency
4. **Monitor Performance**: Track success rates and response times
5. **Scale Gradually**: Increase scope as you refine your approach

## Need Help?

Web scraping for market research requires technical expertise and legal awareness. Our team specializes in building ethical, efficient scraping solutions for Icelandic businesses.

**Ready to gain market insights?** [Contact us](/contact) for a custom web scraping solution!
""",
        "author": "KusseTechStudio Team",
        "published_date": datetime(2024, 12, 10),
        "updated_date": datetime(2024, 12, 10),
        "category": "web-scraping",
        "tags": ["python", "web-scraping", "market-research", "iceland", "beautifulsoup"],
        "featured": False,
        "reading_time": 12,
        "image": "web-scraping-iceland.jpg",
        "meta_description": "Complete guide to ethical web scraping for market research in Iceland. Learn Python techniques with BeautifulSoup and Selenium for business intelligence.",
        "status": "published"
    },
    {
        "id": 3,
        "title": "Building Data Dashboards for Icelandic Tourism Industry",
        "slug": "data-dashboards-iceland-tourism",
        "excerpt": "Create powerful data visualization dashboards for Iceland's tourism industry using Python, Plotly, and real-time data integration.",
        "content": """# Building Data Dashboards for Icelandic Tourism Industry

Iceland's tourism industry generates massive amounts of data. Here's how to transform that data into actionable insights with Python dashboards.

## Why Data Dashboards Matter

Tourism businesses in Iceland need real-time insights to:

- Track visitor trends and seasonality
- Optimize pricing strategies
- Monitor competition
- Identify growth opportunities
- Make data-driven decisions

## Tools We'll Use

```python
import plotly.dash as dash
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import requests
from datetime import datetime, timedelta
```

## Dashboard Architecture

### 1. Data Collection Layer

```python
class TourismDataCollector:
    def __init__(self):
        self.weather_api = "your_weather_api_key"
        self.booking_data = "path/to/booking_data.csv"
    
    def get_weather_data(self):
        # Get Iceland weather data
        response = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?q=Reykjavik,IS&appid={self.weather_api}"
        )
        return response.json()
    
    def get_visitor_statistics(self):
        # Simulate visitor data (replace with real API)
        dates = pd.date_range(
            start='2024-01-01', 
            end='2024-12-31', 
            freq='D'
        )
        
        visitors = []
        for date in dates:
            # Simulate seasonal patterns
            base_visitors = 1000
            seasonal_factor = 1.5 if date.month in [6, 7, 8] else 0.7
            daily_visitors = int(base_visitors * seasonal_factor * 
                               (1 + 0.1 * np.random.randn()))
            
            visitors.append({
                'date': date,
                'visitors': daily_visitors,
                'revenue': daily_visitors * 150  # Average spend
            })
        
        return pd.DataFrame(visitors)
```

### 2. Data Processing

```python
def process_tourism_data(raw_data):
    df = raw_data.copy()
    
    # Add time-based features
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    df['week'] = df['date'].dt.isocalendar().week
    
    # Calculate moving averages
    df['visitors_7day_avg'] = df['visitors'].rolling(window=7).mean()
    df['visitors_30day_avg'] = df['visitors'].rolling(window=30).mean()
    
    # Seasonal decomposition
    df['month_name'] = df['date'].dt.strftime('%B')
    
    return df

def calculate_kpis(df):
    latest_date = df['date'].max()
    last_30_days = df[df['date'] >= latest_date - timedelta(days=30)]
    
    kpis = {
        'total_visitors_30d': last_30_days['visitors'].sum(),
        'avg_daily_visitors': last_30_days['visitors'].mean(),
        'total_revenue_30d': last_30_days['revenue'].sum(),
        'revenue_per_visitor': last_30_days['revenue'].sum() / last_30_days['visitors'].sum()
    }
    
    return kpis
```

### 3. Interactive Dashboard

```python
import dash
from dash import dcc, html, Input, Output
import plotly.graph_objects as go
import plotly.express as px

# Initialize the Dash app
app = dash.Dash(__name__)

# Load and process data
collector = TourismDataCollector()
raw_data = collector.get_visitor_statistics()
df = process_tourism_data(raw_data)
kpis = calculate_kpis(df)

# Dashboard layout
app.layout = html.Div([
    html.H1("Iceland Tourism Dashboard", 
            style={'textAlign': 'center', 'color': '#2c3e50'}),
    
    # KPI Cards
    html.Div([
        html.Div([
            html.H3(f"{kpis['total_visitors_30d']:,.0f}"),
            html.P("Visitors (30 days)")
        ], className='kpi-card'),
        
        html.Div([
            html.H3(f"{kpis['avg_daily_visitors']:,.0f}"),
            html.P("Avg Daily Visitors")
        ], className='kpi-card'),
        
        html.Div([
            html.H3(f"${kpis['total_revenue_30d']:,.0f}"),
            html.P("Revenue (30 days)")
        ], className='kpi-card'),
        
        html.Div([
            html.H3(f"${kpis['revenue_per_visitor']:.0f}"),
            html.P("Revenue per Visitor")
        ], className='kpi-card')
    ], className='kpi-container'),
    
    # Date range picker
    html.Div([
        dcc.DatePickerRange(
            id='date-picker-range',
            start_date=df['date'].min(),
            end_date=df['date'].max(),
            display_format='YYYY-MM-DD'
        )
    ], style={'margin': '20px', 'textAlign': 'center'}),
    
    # Main charts
    html.Div([
        # Visitor trends
        html.Div([
            dcc.Graph(id='visitor-trends')
        ], style={'width': '50%', 'display': 'inline-block'}),
        
        # Revenue trends
        html.Div([
            dcc.Graph(id='revenue-trends')
        ], style={'width': '50%', 'display': 'inline-block'})
    ]),
    
    html.Div([
        # Seasonal patterns
        html.Div([
            dcc.Graph(id='seasonal-patterns')
        ], style={'width': '50%', 'display': 'inline-block'}),
        
        # Day of week analysis
        html.Div([
            dcc.Graph(id='day-of-week')
        ], style={'width': '50%', 'display': 'inline-block'})
    ])
])

# Callbacks for interactivity
@app.callback(
    [Output('visitor-trends', 'figure'),
     Output('revenue-trends', 'figure'),
     Output('seasonal-patterns', 'figure'),
     Output('day-of-week', 'figure')],
    [Input('date-picker-range', 'start_date'),
     Input('date-picker-range', 'end_date')]
)
def update_charts(start_date, end_date):
    # Filter data based on date range
    filtered_df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]
    
    # Visitor trends chart
    visitor_fig = go.Figure()
    visitor_fig.add_trace(go.Scatter(
        x=filtered_df['date'],
        y=filtered_df['visitors'],
        mode='lines',
        name='Daily Visitors',
        line=dict(color='#3498db')
    ))
    visitor_fig.add_trace(go.Scatter(
        x=filtered_df['date'],
        y=filtered_df['visitors_7day_avg'],
        mode='lines',
        name='7-day Average',
        line=dict(color='#e74c3c', dash='dash')
    ))
    visitor_fig.update_layout(
        title='Visitor Trends',
        xaxis_title='Date',
        yaxis_title='Number of Visitors'
    )
    
    # Revenue trends chart
    revenue_fig = px.line(
        filtered_df, 
        x='date', 
        y='revenue',
        title='Revenue Trends',
        labels={'revenue': 'Revenue ($)', 'date': 'Date'}
    )
    revenue_fig.update_traces(line_color='#27ae60')
    
    # Seasonal patterns
    monthly_data = filtered_df.groupby('month_name')['visitors'].mean().reset_index()
    month_order = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    monthly_data['month_name'] = pd.Categorical(
        monthly_data['month_name'], 
        categories=month_order, 
        ordered=True
    )
    monthly_data = monthly_data.sort_values('month_name')
    
    seasonal_fig = px.bar(
        monthly_data,
        x='month_name',
        y='visitors',
        title='Average Visitors by Month',
        labels={'visitors': 'Average Visitors', 'month_name': 'Month'}
    )
    seasonal_fig.update_traces(marker_color='#f39c12')
    
    # Day of week analysis
    dow_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
                 'Friday', 'Saturday', 'Sunday']
    dow_data = filtered_df.groupby('day_of_week')['visitors'].mean().reset_index()
    dow_data['day_name'] = [dow_names[i] for i in dow_data['day_of_week']]
    
    dow_fig = px.bar(
        dow_data,
        x='day_name',
        y='visitors',
        title='Average Visitors by Day of Week',
        labels={'visitors': 'Average Visitors', 'day_name': 'Day of Week'}
    )
    dow_fig.update_traces(marker_color='#9b59b6')
    
    return visitor_fig, revenue_fig, seasonal_fig, dow_fig

# CSS styling
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <style>
            .kpi-container {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
            }
            .kpi-card {
                background: #ecf0f1;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                min-width: 150px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .kpi-card h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 2em;
            }
            .kpi-card p {
                margin: 5px 0 0 0;
                color: #7f8c8d;
            }
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''
```

## Advanced Features

### Real-time Data Integration

```python
import sqlite3
from apscheduler.schedulers.background import BackgroundScheduler

class RealTimeDashboard:
    def __init__(self):
        self.db_path = 'tourism_data.db'
        self.setup_database()
        self.scheduler = BackgroundScheduler()
        
    def setup_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS visitor_data (
                date DATE,
                visitors INTEGER,
                revenue REAL,
                weather_temp REAL,
                weather_condition TEXT
            )
        ''')
        conn.commit()
        conn.close()
    
    def collect_real_time_data(self):
        # This would run every hour to collect new data
        collector = TourismDataCollector()
        weather_data = collector.get_weather_data()
        
        # Simulate current visitor count
        current_visitors = self.estimate_current_visitors(weather_data)
        
        # Store in database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO visitor_data 
            (date, visitors, revenue, weather_temp, weather_condition)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            datetime.now().date(),
            current_visitors,
            current_visitors * 150,
            weather_data.get('main', {}).get('temp', 0) - 273.15,  # Convert to Celsius
            weather_data.get('weather', [{}])[0].get('main', 'Unknown')
        ))
        conn.commit()
        conn.close()
    
    def estimate_current_visitors(self, weather_data):
        # Simple model based on weather and time
        base_visitors = 800
        temp_celsius = weather_data.get('main', {}).get('temp', 273.15) - 273.15
        
        # Weather impact
        if temp_celsius > 10:
            weather_factor = 1.2
        elif temp_celsius < 0:
            weather_factor = 0.8
        else:
            weather_factor = 1.0
        
        # Time of day impact
        hour = datetime.now().hour
        if 9 <= hour <= 17:
            time_factor = 1.3
        else:
            time_factor = 0.7
        
        return int(base_visitors * weather_factor * time_factor)
    
    def start_data_collection(self):
        # Schedule data collection every hour
        self.scheduler.add_job(
            func=self.collect_real_time_data,
            trigger="interval",
            hours=1
        )
        self.scheduler.start()
```

### Mobile-Responsive Design

```python
# Add mobile responsiveness to the dashboard
mobile_layout = html.Div([
    html.Meta(name="viewport", content="width=device-width, initial-scale=1"),
    
    # Responsive KPI cards
    html.Div([
        html.Div([
            html.H4(f"{kpis['total_visitors_30d']:,.0f}"),
            html.P("Visitors")
        ], className='mobile-kpi-card'),
        
        html.Div([
            html.H4(f"${kpis['total_revenue_30d']:,.0f}"),
            html.P("Revenue")
        ], className='mobile-kpi-card')
    ], className='mobile-kpi-container'),
    
    # Single column layout for mobile
    html.Div([
        dcc.Graph(id='mobile-visitor-trends', 
                 config={'displayModeBar': False})
    ])
])

# Add mobile CSS
mobile_css = '''
@media (max-width: 768px) {
    .mobile-kpi-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .mobile-kpi-card {
        background: #ecf0f1;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
    }
}
'''
```

## Deployment on Iceland Servers

### Using Icelandic Cloud Providers

```python
# Example deployment script for Iceland hosting
import os
from flask import Flask

def create_production_app():
    app = Flask(__name__)
    
    # Iceland-specific configuration
    app.config.update(
        SECRET_KEY=os.environ.get('SECRET_KEY'),
        DATABASE_URL=os.environ.get('ICELAND_DB_URL'),
        REDIS_URL=os.environ.get('ICELAND_REDIS_URL'),
        # Use Iceland timezone
        TIMEZONE='Atlantic/Reykjavik'
    )
    
    return app

# Docker deployment
docker_compose = '''
version: '3.8'
services:
  dashboard:
    build: .
    ports:
      - "8050:8050"
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
'''
```

## Business Impact Metrics

Track these KPIs to measure dashboard success:

```python
def calculate_business_impact():
    metrics = {
        'decision_speed': 'Time to identify trends: 5 minutes vs 2 hours',
        'revenue_optimization': 'Dynamic pricing based on demand patterns',
        'cost_savings': 'Reduced manual reporting time by 15 hours/week',
        'accuracy_improvement': '99% vs 85% manual data accuracy'
    }
    
    return metrics
```

## Getting Started

1. **Data Audit**: Identify all tourism data sources
2. **MVP Dashboard**: Start with visitor count and revenue
3. **Iterative Enhancement**: Add features based on user feedback
4. **Mobile Optimization**: Ensure mobile accessibility
5. **Real-time Integration**: Connect live data feeds

## Need a Custom Dashboard?

Every tourism business has unique metrics and requirements. Our team builds custom analytics dashboards that turn your data into actionable insights.

**Ready to visualize your data?** [Contact us](/contact) for a custom dashboard solution!
""",
        "author": "KusseTechStudio Team",
        "published_date": datetime(2024, 12, 5),
        "updated_date": datetime(2024, 12, 5),
        "category": "data-visualization",
        "tags": ["python", "dashboard", "plotly", "tourism", "iceland", "data-visualization"],
        "featured": True,
        "reading_time": 15,
        "image": "iceland-tourism-dashboard.jpg",
        "meta_description": "Build powerful data visualization dashboards for Iceland's tourism industry using Python, Plotly, and real-time data integration.",
        "status": "published"
    }
]

# Blog categories
CATEGORIES = {
    "automation": {
        "name": "Python Automation",
        "description": "Scripts and tools to automate business processes",
        "color": "#3498db"
    },
    "web-scraping": {
        "name": "Web Scraping",
        "description": "Data collection and market research techniques",
        "color": "#e74c3c"
    },
    "data-visualization": {
        "name": "Data Visualization",
        "description": "Creating insights through charts and dashboards",
        "color": "#27ae60"
    },
    "tutorials": {
        "name": "Tutorials",
        "description": "Step-by-step guides and how-tos",
        "color": "#f39c12"
    },
    "case-studies": {
        "name": "Case Studies",
        "description": "Real-world project examples and results",
        "color": "#9b59b6"
    }
}


def calculate_reading_time(content):
    """Estimate reading time based on content length"""
    word_count = len(content.split())
    reading_speed = 200  # words per minute
    return max(1, round(word_count / reading_speed))


def render_markdown(content):
    """Convert markdown to HTML with syntax highlighting"""
    md = markdown.Markdown(
        extensions=['codehilite', 'fenced_code', 'tables', 'toc'],
        extension_configs={
            'codehilite': {
                'css_class': 'highlight',
                'use_pygments': True
            }
        }
    )
    return Markup(md.convert(content))


@bp.route("/")
def blog_index():
    """Blog listing page"""
    # Get query parameters
    category = request.args.get('category')
    tag = request.args.get('tag')
    search = request.args.get('search', '').strip()
    page = int(request.args.get('page', 1))
    
    # Filter posts
    posts = [post for post in BLOG_POSTS if post['status'] == 'published']
    
    if category:
        posts = [post for post in posts if post['category'] == category]
    
    if tag:
        posts = [post for post in posts if tag in post['tags']]
    
    if search:
        search_lower = search.lower()
        posts = [
            post for post in posts 
            if search_lower in post['title'].lower() 
            or search_lower in post['excerpt'].lower()
            or search_lower in ' '.join(post['tags']).lower()
        ]
    
    # Sort by published date (newest first)
    posts.sort(key=lambda x: x['published_date'], reverse=True)
    
    # Pagination
    per_page = 6
    total_posts = len(posts)
    total_pages = (total_posts + per_page - 1) // per_page
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    posts_page = posts[start_idx:end_idx]
    
    # Get featured posts for sidebar
    featured_posts = [post for post in BLOG_POSTS if post.get('featured', False)][:3]
    
    # Get popular tags
    all_tags = []
    for post in BLOG_POSTS:
        all_tags.extend(post['tags'])
    
    tag_counts = defaultdict(int)
    for tag in all_tags:
        tag_counts[tag] += 1
    
    popular_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return render_template(
        "pages/blog/index.html",
        posts=posts_page,
        categories=CATEGORIES,
        featured_posts=featured_posts,
        popular_tags=popular_tags,
        current_category=category,
        current_tag=tag,
        search_query=search,
        pagination={
            'page': page,
            'per_page': per_page,
            'total': total_posts,
            'pages': total_pages,
            'has_prev': page > 1,
            'has_next': page < total_pages,
            'prev_num': page - 1 if page > 1 else None,
            'next_num': page + 1 if page < total_pages else None
        },
        title="Python Automation Blog - KusseTechStudio",
        meta_description="Latest insights on Python automation, web scraping, and data analysis for Icelandic businesses. Practical tutorials and case studies."
    )


@bp.route("/<slug>")
def blog_post(slug):
    """Individual blog post page"""
    # Find post by slug
    post = next((p for p in BLOG_POSTS if p['slug'] == slug and p['status'] == 'published'), None)
    
    if not post:
        abort(404)
    
    # Render markdown content
    post['content_html'] = render_markdown(post['content'])
    
    # Get related posts (same category, excluding current post)
    related_posts = [
        p for p in BLOG_POSTS 
        if p['category'] == post['category'] 
        and p['id'] != post['id'] 
        and p['status'] == 'published'
    ][:3]
    
    # Get next and previous posts
    all_posts = sorted(
        [p for p in BLOG_POSTS if p['status'] == 'published'],
        key=lambda x: x['published_date']
    )
    
    current_index = next(
        (i for i, p in enumerate(all_posts) if p['id'] == post['id']),
        None
    )
    
    prev_post = all_posts[current_index - 1] if current_index and current_index > 0 else None
    next_post = all_posts[current_index + 1] if current_index is not None and current_index < len(all_posts) - 1 else None
    
    return render_template(
        "pages/blog/post.html",
        post=post,
        related_posts=related_posts,
        prev_post=prev_post,
        next_post=next_post,
        category_info=CATEGORIES.get(post['category'], {}),
        title=f"{post['title']} - KusseTechStudio Blog",
        meta_description=post['meta_description']
    )


@bp.route("/category/<category>")
def blog_category(category):
    """Blog posts by category"""
    if category not in CATEGORIES:
        abort(404)
    
    return blog_index() + f"?category={category}"


@bp.route("/tag/<tag>")
def blog_tag(tag):
    """Blog posts by tag"""
    return blog_index() + f"?tag={tag}"


@bp.route("/rss")
def rss_feed():
    """RSS feed for blog posts"""
    from flask import Response
    
    posts = sorted(
        [p for p in BLOG_POSTS if p['status'] == 'published'],
        key=lambda x: x['published_date'],
        reverse=True
    )[:10]  # Latest 10 posts
    
    rss_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
    <title>KusseTechStudio Blog</title>
    <description>Python automation insights for Icelandic businesses</description>
    <link>{request.url_root}blog</link>
    <language>en-us</language>
    <lastBuildDate>{datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}</lastBuildDate>
    
"""
    
    for post in posts:
        rss_xml += f"""    <item>
        <title>{post['title']}</title>
        <description>{post['excerpt']}</description>
        <link>{request.url_root}blog/{post['slug']}</link>
        <guid>{request.url_root}blog/{post['slug']}</guid>
        <pubDate>{post['published_date'].strftime('%a, %d %b %Y %H:%M:%S GMT')}</pubDate>
        <category>{CATEGORIES.get(post['category'], {}).get('name', post['category'])}</category>
    </item>
"""
    
    rss_xml += """</channel>
</rss>"""
    
    return Response(rss_xml, mimetype='application/rss+xml')


@bp.route("/search")
def blog_search():
    """Search blog posts"""
    return blog_index()  # Uses search parameter from query string
