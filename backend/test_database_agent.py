from agents.database_agent import database_agent

records = database_agent.search_by_hcp(
    "Dr Sharma"
)

print("\nResults\n")

for record in records:

    print(record.id)

    print(record.hcp_name)

    print(record.product)

    print(record.summary)

    print(record.follow_up)

    print("-" * 40)