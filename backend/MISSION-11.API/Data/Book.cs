using System;
using System.Collections.Generic;

namespace MISSION_11.API.Data;

using System.Text.Json.Serialization;

public partial class Book
{
    public int BookId { get; set; }

    public string Title { get; set; } = null!;

    public string Author { get; set; } = null!;

    public string Publisher { get; set; } = null!;

    [JsonPropertyName("isbn")]
    public string Isbn { get; set; } = null!;

    [JsonPropertyName("classification")]
    public string Classification { get; set; } = null!;

    [JsonPropertyName("category")]
    public string Category { get; set; } = null!;

    [JsonPropertyName("pageCount")]
    public int PageCount { get; set; }

    [JsonPropertyName("price")]
    public double Price { get; set; }
}
