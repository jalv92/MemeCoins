# Pump Bot Development Guide

This is a trading bot for pump.fun and letsbonk.fun platforms that snipes new tokens and implements various trading strategies.

## Project Structure

- `src/` - Main source code
- `learning-examples/` - Educational scripts and examples
- `bots/` - Bot configuration files (YAML)
- `logs/` - Log files from bot executions
- `idl/` - Interface definition files for Solana programs

## Bash Commands & Development

### Setup Commands
```bash
# Install dependencies
uv sync

# Activate virtual environment (Unix/macOS)
source .venv/bin/activate

# Install as editable package
uv pip install -e .
```

### Running the Bot
```bash
# Run as installed package
pump_bot

# Run directly
uv run src/bot_runner.py
```

### Learning Examples
```bash
# Bonding curve status
uv run learning-examples/bonding-curve-progress/get_bonding_curve_status.py TOKEN_ADDRESS

# Listen to migrations
uv run learning-examples/listen-migrations/listen_logsubscribe.py
uv run learning-examples/listen-migrations/listen_blocksubscribe_old_raydium.py

# Compute associated bonding curve
uv run learning-examples/compute_associated_bonding_curve.py

# Listen to new tokens
uv run learning-examples/listen-new-tokens/listen_logsubscribe_abc.py
uv run learning-examples/listen-new-tokens/compare_listeners.py
```

### Code Quality
```bash
# Format code
ruff format

# Lint code
ruff check

# Fix linting issues
ruff check --fix
```

## Code Style & Conventions

### Python Style (Ruff Configuration)
- **Line length**: 88 characters
- **Indentation**: 4 spaces
- **Target Python**: 3.11+
- **Quote style**: Double quotes
- **Import sorting**: Enabled

### Linting Rules
- Security best practices (S)
- Type annotations (ANN)
- Exception handling (BLE, TRY)
- Code complexity (C90)
- Pylint conventions (PL)
- No commented-out code (ERA)

### Code Organization
- **Imports**: Standard library, third-party, local imports
- **Docstrings**: Google-style for functions and classes
- **Type hints**: Required for all public functions
- **Logging**: Use `get_logger(__name__)` pattern
- **Error handling**: Comprehensive try-catch with proper logging

### File Structure Patterns
- `__init__.py` files for all packages
- Separate concerns: client, trading, monitoring, platforms
- Abstract base classes in `interfaces/`
- Platform-specific implementations in `platforms/`

## Workflow & Development Practices

### Configuration Management
- Environment variables in `.env` file
- Bot configurations in YAML files under `bots/`
- Platform detection from config files
- Validation of platform-listener combinations

### Logging
- Timestamped log files in `logs/` directory
- Format: `{bot_name}_{timestamp}.log`
- Different log levels for development vs production
- Centralized logger utility in `utils/logger.py`

### Trading Architecture
- Universal trader pattern for platform abstraction
- Platform-specific implementations (pumpfun, letsbonk)
- Position tracking and management
- Priority fee management (dynamic/fixed)

### Monitoring Systems
- Multiple listener types: logs, blocks, geyser, pumpportal
- Universal listeners with platform abstraction
- Event parsing and processing
- Real-time data stream handling

### Development Workflow
1. Make changes to source code
2. Run `ruff check --fix` for linting
3. Run `ruff format` for formatting
4. Test with learning examples (standalone scripts) before deploying bots
5. Use separate processes for production bot instances

### Bot Configuration
- YAML-based configuration files
- Environment variable interpolation
- Platform-specific settings
- Trading parameters (slippage, amounts, timeouts)
- Filter configurations for token selection
- Cleanup and account management settings

### Testing Strategy
- Learning examples serve as integration tests
- Manual testing with learning scripts
- Configuration validation before bot startup
- Logging verification for debugging

## Key Features

- **Multi-platform support**: pump.fun and letsbonk.fun
- **Multiple listening methods**: WebSocket logs, block subscription, Geyser
- **Trading strategies**: Time-based, take profit/stop loss, manual
- **Priority fee management**: Dynamic and fixed fee strategies
- **Account cleanup**: Automated token account management
- **Extreme fast mode**: Skip validation for faster execution

## Security Considerations

- Private keys stored in environment variables
- No sensitive data in configuration files
- Comprehensive input validation
- Error handling to prevent crashes
- Rate limiting and retry mechanisms