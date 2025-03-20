-- Edge Gateways Table
CREATE TABLE IF NOT EXISTS edge_gateways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  model_id UUID REFERENCES device_models(id),
  mac_address VARCHAR(50),
  firmware_version VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  last_seen TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Edge Gateway IP Addresses Table
CREATE TABLE IF NOT EXISTS edge_gateway_ip_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edge_gateway_id UUID NOT NULL REFERENCES edge_gateways(id) ON DELETE CASCADE,
  ip_address VARCHAR(50) NOT NULL,
  port INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Edge Gateway Specifications Table
CREATE TABLE IF NOT EXISTS edge_gateway_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edge_gateway_id UUID NOT NULL REFERENCES edge_gateways(id) ON DELETE CASCADE,
  os VARCHAR(100),
  os_version VARCHAR(100),
  cpu VARCHAR(100),
  memory VARCHAR(100),
  storage VARCHAR(100),
  connectivity TEXT[] DEFAULT '{}',
  additional_specs TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Edge Gateway Connection Details Table
CREATE TABLE IF NOT EXISTS edge_gateway_connection_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edge_gateway_id UUID NOT NULL REFERENCES edge_gateways(id) ON DELETE CASCADE,
  ssh_username VARCHAR(100),
  ssh_password VARCHAR(255),
  ssh_key TEXT,
  web_interface_url VARCHAR(255),
  web_username VARCHAR(100),
  web_password VARCHAR(255),
  api_key VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_edge_gateways_model_id ON edge_gateways(model_id);
CREATE INDEX IF NOT EXISTS idx_edge_gateways_status ON edge_gateways(status);
CREATE INDEX IF NOT EXISTS idx_edge_gateway_ip_addresses_gateway_id ON edge_gateway_ip_addresses(edge_gateway_id);
CREATE INDEX IF NOT EXISTS idx_edge_gateway_specifications_gateway_id ON edge_gateway_specifications(edge_gateway_id);
CREATE INDEX IF NOT EXISTS idx_edge_gateway_connection_details_gateway_id ON edge_gateway_connection_details(edge_gateway_id);

