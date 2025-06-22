# Rwanda Geo Examples

This directory contains comprehensive examples demonstrating the capabilities of the `rwanda-geo` package.

## Examples Overview

### 1. Basic Usage (`basic-usage.ts`)
Demonstrates fundamental operations with the package:
- Getting all administrative units at each level
- Displaying provinces, districts, sectors, cells, and villages
- Hierarchical navigation (parent-child relationships)
- Getting specific units by code
- Hierarchy traversal
- Summary statistics and averages

### 2. Advanced Search (`advanced-search.ts`)
Shows advanced search capabilities:
- Fuzzy search with Levenshtein distance scoring
- Partial code matching
- Autocomplete suggestions
- Exact name and slug search
- Search performance testing
- Code pattern analysis

### 3. Hierarchical Navigation (`hierarchical-navigation.ts`)
Demonstrates hierarchical navigation features:
- Full hierarchy traversal
- Direct children retrieval
- Sibling analysis
- Descendant statistics
- Breadcrumb navigation
- Tree structure visualization
- Navigation path finding

### 4. Validation Examples (`validation-examples.ts`)
Shows validation capabilities:
- Code format validation
- Parent-child relationship validation
- Hierarchy integrity checks
- Unit property validation
- Code level determination
- Comprehensive validation examples
- Performance testing

### 5. Practical Applications (`practical-applications.ts`)
Real-world use cases:
- Location selector component
- Search autocomplete component
- Data analysis and reporting
- Geographic visualization helper
- Data export and integration
- Performance monitoring

## Running the Examples

To run any example, use ts-node:

```bash
# Run basic usage example
npx ts-node examples/basic-usage.ts

# Run advanced search example
npx ts-node examples/advanced-search.ts

# Run hierarchical navigation example
npx ts-node examples/hierarchical-navigation.ts

# Run validation examples
npx ts-node examples/validation-examples.ts

# Run practical applications example
npx ts-node examples/practical-applications.ts
```

## Example Output

Each example provides detailed console output showing:
- Function calls and their results
- Data structures and relationships
- Performance metrics
- Validation results
- Error handling

## Use Cases

These examples demonstrate how to use `rwanda-geo` for:

### Web Applications
- Location selectors and dropdowns
- Search autocomplete
- Geographic visualization
- Data export functionality

### Data Analysis
- Administrative statistics
- Hierarchy analysis
- Performance benchmarking
- Data validation

### Geographic Applications
- Map integration
- Boundary visualization
- Coordinate handling
- Spatial queries

### Business Applications
- Address validation
- Location-based services
- Administrative reporting
- Data integration

## Key Features Demonstrated

1. **Complete Data Access**: All 17,736 administrative units
2. **Hierarchical Navigation**: Parent-child relationships
3. **Advanced Search**: Fuzzy matching and suggestions
4. **Validation**: Data integrity and format checking
5. **Performance**: Optimized queries and caching
6. **TypeScript Support**: Full type safety
7. **Export Capabilities**: JSON, CSV, and GeoJSON formats

## Integration Examples

The examples show how to integrate with:
- React/Vue/Angular components
- Mapping libraries (Leaflet, Google Maps)
- Data analysis tools
- Reporting systems
- Geographic information systems

## Performance Notes

- All examples include performance benchmarks
- Search operations are optimized for speed
- Hierarchical queries use efficient algorithms
- Data is cached for fast access

## Contributing

When adding new examples:
1. Follow the existing naming convention
2. Include comprehensive comments
3. Demonstrate real-world use cases
4. Add performance benchmarks where relevant
5. Update this README with new example descriptions 