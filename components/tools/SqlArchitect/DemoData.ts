export const COMPLEX_PLAN = `[
  {
    "Plan": {
      "Node Type": "Limit",
      "Parallel Aware": false,
      "Async Capable": false,
      "Startup Cost": 25890.35,
      "Total Cost": 25891.10,
      "Plan Rows": 300,
      "Plan Width": 256,
      "Actual Startup Time": 145.230,
      "Actual Total Time": 145.245,
      "Actual Rows": 300,
      "Actual Loops": 1,
      "Plans": [
        {
          "Node Type": "Sort",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Startup Cost": 25890.35,
          "Total Cost": 26015.35,
          "Plan Rows": 50000,
          "Plan Width": 256,
          "Actual Startup Time": 145.228,
          "Actual Total Time": 145.235,
          "Actual Rows": 300,
          "Actual Loops": 1,
          "Sort Key": ["orders.created_at DESC"],
          "Sort Method": "top-N heapsort",
          "Sort Space Used": 150,
          "Sort Space Type": "Memory",
          "Plans": [
            {
              "Node Type": "Nested Loop",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Async Capable": false,
              "Join Type": "Inner",
              "Startup Cost": 12.45,
              "Total Cost": 24000.50,
              "Plan Rows": 50000,
              "Plan Width": 256,
              "Actual Startup Time": 0.050,
              "Actual Total Time": 110.450,
              "Actual Rows": 50000,
              "Actual Loops": 1,
              "Plans": [
                {
                  "Node Type": "Seq Scan",
                  "Parent Relationship": "Outer",
                  "Parallel Aware": true,
                  "Async Capable": false,
                  "Relation Name": "users",
                  "Alias": "u",
                  "Startup Cost": 0.00,
                  "Total Cost": 5050.50,
                  "Plan Rows": 10000,
                  "Plan Width": 128,
                  "Actual Startup Time": 0.015,
                  "Actual Total Time": 40.200,
                  "Actual Rows": 10000,
                  "Actual Loops": 1,
                  "Filter": "(active = true)"
                },
                {
                  "Node Type": "Index Scan",
                  "Parent Relationship": "Inner",
                  "Parallel Aware": false,
                  "Async Capable": false,
                  "Scan Direction": "Forward",
                  "Index Name": "idx_orders_user_id",
                  "Relation Name": "orders",
                  "Alias": "o",
                  "Startup Cost": 0.42,
                  "Total Cost": 1.85,
                  "Plan Rows": 5,
                  "Plan Width": 128,
                  "Actual Startup Time": 0.002,
                  "Actual Total Time": 0.005,
                  "Actual Rows": 5,
                  "Actual Loops": 10000,
                  "Index Cond": "(user_id = u.id)"
                }
              ]
            }
          ]
        }
      ]
    }
  }
]`;
