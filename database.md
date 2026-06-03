## Table `profiles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  Nullable |
| `full_name` | `text` |  |
| `phone_number` | `text` |  Nullable Unique |
| `role` | `text` |  |
| `address` | `text` |  Nullable |
| `city` | `text` |  Nullable |
| `country` | `text` |  Nullable |
| `latitude` | `float8` |  Nullable |
| `longitude` | `float8` |  Nullable |
| `avatar_url` | `text` |  Nullable |
| `website` | `text` |  Nullable |
| `expo_push_token` | `text` |  Nullable |

## Table `stores`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `phone` | `text` |  Nullable |
| `status` | `text` |  Nullable |
| `location_lat` | `float8` |  Nullable |
| `location_lng` | `float8` |  Nullable |
| `created_at` | `timestamp` |  Nullable |
| `category` | `text` |  Nullable |
| `owner_id` | `uuid` |  Nullable |
| `opens_at` | `time` |  Nullable |
| `closes_at` | `time` |  Nullable |
| `call_enabled` | `bool` |  Nullable |
| `is_open` | `bool` |  Nullable |
| `active` | `bool` |  |

## Table `products`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  Nullable |
| `name` | `text` |  |
| `price` | `numeric` |  Nullable |
| `image` | `text` |  Nullable |
| `category` | `text` |  Nullable |
| `created_at` | `timestamp` |  Nullable |

## Table `reviews`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  Nullable |
| `stars` | `int4` |  Nullable |
| `likes` | `int4` |  Nullable |
| `date` | `date` |  Nullable |
| `created_at` | `timestamp` |  Nullable |

## Table `carts`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable Unique |
| `created_at` | `timestamp` |  Nullable |

## Table `cart_items`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `cart_id` | `uuid` |  Nullable |
| `product_id` | `uuid` |  Nullable |
| `quantity` | `int4` |  |
| `added_at` | `timestamp` |  Nullable |

## Table `store_images`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  Nullable |
| `image_url` | `text` |  |
| `is_cover` | `bool` |  Nullable |
| `created_at` | `timestamp` |  Nullable |

## Table `orders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `status` | `text` |  |
| `total_price` | `numeric` |  Nullable |
| `delivery_fee` | `numeric` |  Nullable |
| `delivery_lat` | `numeric` |  Nullable |
| `delivery_lng` | `numeric` |  Nullable |
| `delivery_address` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `delivery` | `uuid` |  Nullable |

## Table `order_items`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  Nullable |
| `product_id` | `uuid` |  Nullable |
| `store_id` | `uuid` |  Nullable |
| `quantity` | `int4` |  |
| `unit_price` | `numeric` |  |
| `status` | `text` |  |
| `store_order_id` | `uuid` |  Nullable |
| `selected_options` | `jsonb` |  Nullable |
| `custom_text` | `text` |  Nullable |
| `custom_audio_url` | `text` |  Nullable |
| `custom_images` | `jsonb` |  Nullable |
| `item_type` | `text` |  |

## Table `store_orders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  |
| `store_id` | `uuid` |  |
| `status` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |
| `notes` | `text` |  Nullable |

## Table `notifications`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `title` | `text` |  |
| `body` | `text` |  |
| `order_id` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `is_read` | `bool` |  Nullable |

## Table `expo_push_tokens`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable Unique |
| `push_token` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `product_questions`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `product_id` | `uuid` |  |
| `question` | `text` |  |
| `order` | `int2` |  |
| `created_at` | `timestamptz` |  Nullable |
| `required` | `bool` |  |
| `multiple` | `bool` |  |

## Table `product_question_options`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `question_id` | `uuid` |  |
| `label` | `text` |  |
| `price` | `numeric` |  |
| `order` | `int2` |  |

## Table `store_reviews`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  |
| `user_id` | `uuid` |  |
| `rating` | `int4` |  |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `admin_emails`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `email` | `text` | Primary |
| `added_by` | `text` |  Nullable |
| `added_at` | `timestamptz` |  Nullable |

## Table `user_roles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `user_id` | `uuid` |  |
| `role` | `app_role` |  |

## Table `categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |
| `icon_name` | `text` |  |
| `color` | `text` |  |
| `display_order` | `int2` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `icon_url` | `text` |  Nullable |
| `name_ar` | `text` |  Nullable |
| `name_fr` | `text` |  Nullable |

## Table `custom_orders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `delivery_id` | `uuid` |  Nullable |
| `status` | `text` |  |
| `type` | `text` |  |
| `description` | `text` |  |
| `pickup_address` | `text` |  Nullable |
| `pickup_lat` | `float8` |  Nullable |
| `pickup_lng` | `float8` |  Nullable |
| `dropoff_address` | `text` |  |
| `dropoff_lat` | `float8` |  |
| `dropoff_lng` | `float8` |  |
| `agreed_price` | `numeric` |  Nullable |
| `notes` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `proposed_price` | `numeric` |  Nullable |

## Table `custom_order_messages`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  |
| `sender_id` | `uuid` |  |
| `message` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `custom_order_price_offers`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  |
| `sender_id` | `uuid` |  |
| `amount` | `numeric` |  |
| `status` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `stores_location_backup`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` |  Nullable |
| `name` | `text` |  Nullable |
| `location_lat` | `float8` |  Nullable |
| `location_lng` | `float8` |  Nullable |

## Table `product_categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  |
| `name` | `text` |  |
| `image_url` | `text` |  Nullable |
| `display_order` | `int2` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `pending_calls`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  Nullable |
| `store_phone` | `text` |  Nullable |
| `run_at` | `timestamp` |  Nullable |
| `processed` | `bool` |  Nullable |

## Table `delivery_fee_config`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `base_fee` | `numeric` |  |
| `additional_store_fee` | `numeric` |  |
| `updated_at` | `timestamptz` |  Nullable |
| `long_distance_threshold_km` | `numeric` |  Nullable |
| `long_distance_fee` | `numeric` |  Nullable |
| `long_distance_threshold_2_km` | `numeric` |  Nullable |
| `long_distance_fee_2` | `numeric` |  Nullable |
| `fee_explanation_en` | `text` |  Nullable |
| `fee_explanation_ar` | `text` |  Nullable |
| `fee_explanation_fr` | `text` |  Nullable |
| `first_order_free_enabled` | `bool` |  Nullable |
| `late_night_multiplier` | `numeric` |  |
| `late_night_start_hour` | `int4` |  |

## Table `chat_last_viewed`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `order_id` | `uuid` | Primary |
| `user_id` | `uuid` | Primary |
| `viewed_at` | `timestamptz` |  |

## Table `verification_codes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `phone` | `text` |  |
| `code_hash` | `text` |  |
| `channel` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |
| `expires_at` | `timestamptz` |  Nullable |
| `used` | `bool` |  Nullable |

## Table `whatsapp_otp_codes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `phone` | `text` |  |
| `code` | `text` |  |
| `expires_at` | `timestamptz` |  |
| `used` | `bool` |  |
| `created_at` | `timestamptz` |  |

## Table `store_schedules`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  |
| `timezone` | `text` |  |
| `is_active` | `bool` |  |
| `created_at` | `timestamp` |  |
| `updated_at` | `timestamp` |  |

## Table `store_schedule_intervals`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `schedule_id` | `uuid` |  |
| `weekday` | `int2` |  |
| `start_time` | `time` |  |
| `end_time` | `time` |  |
| `created_at` | `timestamp` |  |
| `updated_at` | `timestamp` |  |

## Table `app_status`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `is_operational` | `bool` |  Nullable |
| `delivery_available` | `bool` |  Nullable |
| `reason_en` | `text` |  Nullable |
| `reason_ar` | `text` |  Nullable |
| `reason_fr` | `text` |  Nullable |
| `estimated_return` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `store_workers`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  |
| `worker_id` | `uuid` |  |
| `created_at` | `timestamp` |  Nullable |

