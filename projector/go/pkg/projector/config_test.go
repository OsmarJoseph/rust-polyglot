package projector_test

import (
	"reflect"
	"testing"

	"github.com/OsmarJoseph/projector/go/pkg/projector"
)

func getOpts(args []string) *projector.Opts {
	return &projector.Opts{
		Args:   args,
		Config: "",
		Pwd:    "",
	}
}

func testConfig(args []string, expectedArgs []string, operation projector.Operation, t *testing.T) {
	opts := getOpts(args)
	config, err := projector.NewConfig(opts)

	if err != nil {
		t.Errorf("unable to get config: %v", err)
	}

	if !reflect.DeepEqual(expectedArgs, config.Args) {
		t.Errorf("expected %v, got %v", expectedArgs, config.Args)
	}

	if config.Operation != operation {
		t.Errorf("expected %v, got %v", operation, config.Operation)
	}
}

func TestConfigPrint(t *testing.T) {
	testConfig([]string{}, []string{}, projector.Print, t)
}

func TestConfigPrintKey(t *testing.T) {
	testConfig([]string{"foo"}, []string{"foo"}, projector.Print, t)
}

func TestConfigAddKeyValue(t *testing.T) {
	testConfig([]string{"add", "foo", "bar"}, []string{"foo", "bar"}, projector.Add, t)
}

func TestConfigRemoveKeyValue(t *testing.T) {
	testConfig([]string{"rm", "foo"}, []string{"foo"}, projector.Remove, t)
}
