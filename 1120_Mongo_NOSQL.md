# Aggregations

```
[{ $group: { _id: "$院系", count: { $sum: 1 } } }]
```