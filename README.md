# Analysis Assistant BI - *front-end*

## About

The "Analysis Assistant BI" enables users with limited data analysis skills to swiftly analyze data by entering their objectives, thus saving costs on analysis and chart design.

Unlike traditional BI tools, users only need to input the raw dataset and analysis objectives to leverage AI for generating charts and analysis conclusions, capable of fulfilling 60% of daily usage requirements. Additionally, the system offers user-friendly chart management and asynchronous generation.

> This system have both back-end and front-end, current repo are **front-end**:
>
> - [Analysis Assistant BI (Business Intelligent) - back-end](https://github.com/becoze/bi-back) (See back-end source code in this repo...)
>
> - Analysis Assistant BI (Business Intelligent) - front-end (<- We are here)


## Features
### AIGC
- Analysis (synchronous): Use AI to generate corresponding JSON data based on the user's uploaded CSV file and use ECharts to visualize and display the analysis results.
- Analysis (asynchronous): Use thread pools combined with RabbitMQ message queues to asynchronously generate charts, ensuring the reliability of messages and implementing a message retry mechanism.
- AI Prompting: Backend expandable AI prompt presets able to change any time to fit business/user need.

### Performance
- Easy Excel: Parse the user-uploaded XLSX spreadsheet data file and compress it into CSV format. It was tested and increased the single input data volume by 20% while saving costs.
- User rate limiting: Utilize the token bucket rate limiting algorithm, using Redisson to restrict users to calling the specified number of interfaces only within a fixed time period (in seconds), preventing users from maliciously occupying system resources.
- Dead-letter queue: Bind the queue processing the charts to a dead-letter queue, ensuring that failed requests due to AI processing are recorded and not lost, thus guaranteeing message reliability.

### Other
- Spring Session Redis for distributed login.
- Multi-environment configuration.
- Global exception handler + custom error codes.

## Tech Stack
### Front-end
1. React 18
2. Ant Design Pro 5.x scaffold & library
3. OpenAPI: Automatically generate api code
4. EChart: chart generation

### Back-end
1. Java Spring Boot
2. MySQL Database
3. Redis: Redisson for rate limiting
4. JDK: thread pool (rate limited & access control) and asynchronization
5. MyBatis Plus: data access
6. MyBatisX (IDEA plugin): auto-generate code based on database tables
7. **RabbitMQ**: message queue
8. ChatGPT AI SDK: AI power
9. Swagger + Knife4: project documentation
10. Easy Excel: spreadsheet data processing
11. JUnit5: unit test
12. Other: Hutool utility library, Apache Common Utils, Gson parsing library, Lombok annotations

## Quick Start
### Environment (recommended)
- Java Version：1.8.0_371
- MySQL：8.0.20
- Redis：5.0.14
- Erlang：24.2
- RabbitMQ：3.9.11

### Front-end
1. Install `node_modules`:
    ```
    npm install 
    ```
   or
    ```
    yarn
    ```
2. Build
    ```
    npm start
    ```
3. Run
    ```
    npm run dev
    ```
4. Open `localhost:8000` in browser

### Back-end
1. Download/clone the project to your local machine.
2. Open the project in your IDE and wait for dependencies to be downloaded.
3. Modify the configuration file `application.yaml`.
  1. Database
     ```yml
     spring:
        datasource:
           driver-class-name: com.mysql.cj.jdbc.Driver
           url: jdbc:mysql://localhost:3306/[Your database]
           username: [root or your username]
           password: [your password]
     ```
  2. Redis
     ```yml
     spring:
       redis:
         database: 1 
         host: localhost
         port: 6379
         timeout: 5000
         password: [your password]
        session:
         store-type: redis
     ```
  3. and Other for example: `application:`, `rabbitmq:` etc.
4. Once the modifications are complete, run the project by executing the `MainApplication` program.

## OverView
System Design
![bi_showcase_sysDesign.png](doc%2Fbi_showcase_sysDesign.png)

Synchronous generation - user wait until ai finish generating (right hand side)
![bi_showcase_Sync.png](doc%2Fbi_showcase_Sync.png)

Asynchronous generation - user can do anything while ai generation running at the background
![bi_showcase_Async.png](doc%2Fbi_showcase_Async.png)

Chart (AI result) management
![bi_showcase_mychart.png](doc%2Fbi_showcase_mychart.png)

User account login
![bi_showcase_Login.png](doc%2Fbi_showcase_Login.png)

## Contributing
Contributions are always welcome. GitHub has great instructions on how to [set up Git](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git), [fork a project](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) and make [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests).

## Contact Me
If you have questions or wish to discuss the project further, welcome to reach out!

More contact details > [My profile - becoze](https://github.com/becoze).
